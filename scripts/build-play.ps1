param(
    [switch]$CreateUploadKey,
    [string]$JavaHome = $env:JAVA_HOME,
    [string]$AndroidSdkRoot = 'D:\AndroidDevelopment\AndroidSDK',
    [string]$BundletoolPath
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$secretsDir = Join-Path $projectRoot '.secrets'
$keyPath = Join-Path $secretsDir 'play-upload.p12'
$signingPath = Join-Path $secretsDir 'play-signing.properties'
$releaseDir = Join-Path $projectRoot 'release'
$appConfig = (Get-Content -LiteralPath (Join-Path $projectRoot 'app.json') -Raw | ConvertFrom-Json).expo
$artifactName = "$($appConfig.android.package)-$($appConfig.version)-$($appConfig.android.versionCode)"
$javaExe = Join-Path $JavaHome 'bin/java.exe'
$keytool = Join-Path $JavaHome 'bin/keytool.exe'
if (-not (Test-Path -LiteralPath $javaExe)) { throw 'JDK not found; pass -JavaHome.' }
if (-not (Test-Path -LiteralPath (Join-Path $AndroidSdkRoot 'platforms/android-36'))) {
    throw 'Android SDK Platform 36 not found; pass -AndroidSdkRoot.'
}
New-Item -ItemType Directory -Force -Path $releaseDir | Out-Null

if ($CreateUploadKey) {
    if ((Test-Path -LiteralPath $keyPath) -or (Test-Path -LiteralPath $signingPath)) {
        throw 'Existing upload credentials must not be overwritten.'
    }
    New-Item -ItemType Directory -Force -Path $secretsDir | Out-Null
    $randomBytes = New-Object byte[] 36
    $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($randomBytes) } finally { $rng.Dispose() }
    $password = [Convert]::ToBase64String($randomBytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')
    $env:KKOREA_UPLOAD_PASSWORD = $password
    try {
        & $keytool -genkeypair -keystore $keyPath -storetype PKCS12 -storepass:env KKOREA_UPLOAD_PASSWORD `
            -keypass:env KKOREA_UPLOAD_PASSWORD -alias play-upload -keyalg RSA -keysize 4096 `
            -validity 10000 -dname 'CN=KKorea Hangul, OU=App Upload, C=VN' -noprompt
        if ($LASTEXITCODE -ne 0) { throw 'Upload key generation failed.' }
        [IO.File]::WriteAllLines($signingPath, @(
            'storeFile=play-upload.p12', "storePassword=$password", 'keyAlias=play-upload', "keyPassword=$password"
        ), [Text.Encoding]::ASCII)
    } finally {
        Remove-Item Env:KKOREA_UPLOAD_PASSWORD -ErrorAction SilentlyContinue
        $password = $null
    }
    Write-Output 'Upload credentials created under .secrets/. Back up both files securely.'
}
if (-not (Test-Path -LiteralPath $keyPath) -or -not (Test-Path -LiteralPath $signingPath)) {
    throw 'Restore existing upload credentials. Use -CreateUploadKey only for a new, never-uploaded app.'
}

$originalJavaToolOptions = $env:JAVA_TOOL_OPTIONS
$env:JAVA_HOME = $JavaHome
$env:ANDROID_HOME = $AndroidSdkRoot
$env:ANDROID_SDK_ROOT = $AndroidSdkRoot
$socketDir = Join-Path $releaseDir 'java-sockets'
New-Item -ItemType Directory -Force -Path $socketDir | Out-Null
$env:JAVA_TOOL_OPTIONS = ($originalJavaToolOptions + ' -Djdk.net.unixdomain.tmpdir="' + $socketDir + '"').Trim()
Push-Location $projectRoot
try {
    & npm run typecheck
    if ($LASTEXITCODE -ne 0) { throw 'Typecheck failed.' }
    & npm test -- --runInBand
    if ($LASTEXITCODE -ne 0) { throw 'Tests failed.' }
    & npx expo prebuild --platform android --no-install
    if ($LASTEXITCODE -ne 0) { throw 'Expo Android prebuild failed.' }
    $localProperties = Join-Path $projectRoot 'android/local.properties'
    [IO.File]::WriteAllText($localProperties, 'sdk.dir=' + $AndroidSdkRoot.Replace('\', '/') + "`n", [Text.Encoding]::ASCII)
    Push-Location (Join-Path $projectRoot 'android')
    try {
        & .\gradlew.bat :app:bundleRelease --console=plain --max-workers=2
        if ($LASTEXITCODE -ne 0) { throw 'Gradle bundleRelease failed; do not upload a stale bundle.' }
    } finally { Pop-Location }
    $source = Join-Path $projectRoot 'android/app/build/outputs/bundle/release/app-release.aab'
    $destination = Join-Path $releaseDir "$artifactName.aab"
    $signature = (& (Join-Path $JavaHome 'bin/jarsigner.exe') '-J-Duser.language=en' -verify $source 2>&1 | Out-String)
    $signature | Set-Content -LiteralPath (Join-Path $releaseDir "$artifactName-jarsigner-verify.log") -Encoding utf8
    if ($LASTEXITCODE -ne 0 -or $signature -notmatch '(?m)^jar verified\.') { throw 'Invalid AAB signature.' }
    if ($BundletoolPath) {
        & $javaExe -jar $BundletoolPath validate "--bundle=$source" *> (Join-Path $releaseDir "$artifactName-bundletool-validate.log")
        if ($LASTEXITCODE -ne 0) { throw 'Bundletool validation failed.' }
        $manifestText = (& $javaExe -jar $BundletoolPath dump manifest "--bundle=$source" --module=base | Out-String)
        if ($LASTEXITCODE -ne 0) { throw 'Cannot read bundle manifest.' }
        $manifestText | Set-Content -LiteralPath (Join-Path $releaseDir "$artifactName-AndroidManifest.xml") -Encoding utf8
        [xml]$manifest = $manifestText
        $ns = 'http://schemas.android.com/apk/res/android'
        if ($manifest.manifest.package -ne $appConfig.android.package -or
            $manifest.manifest.GetAttribute('versionName', $ns) -ne $appConfig.version -or
            [int]$manifest.manifest.GetAttribute('versionCode', $ns) -ne $appConfig.android.versionCode -or
            [int]$manifest.manifest.'uses-sdk'.GetAttribute('targetSdkVersion', $ns) -lt 36 -or
            $manifest.manifest.application.GetAttribute('debuggable', $ns) -eq 'true') {
            throw 'AAB package/version/target SDK/release mode does not match app.json.'
        }
    }
    & (Join-Path $PSScriptRoot 'verify-play-native.ps1') -BundlePath $source -JavaHome $JavaHome
    Copy-Item -LiteralPath $source -Destination $destination -Force
    Get-FileHash -LiteralPath $destination -Algorithm SHA256 | Format-List
    Write-Output "Verified AAB: $destination"
} finally {
    Pop-Location
    $env:JAVA_TOOL_OPTIONS = $originalJavaToolOptions
}
