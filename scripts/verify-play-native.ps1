param(
    [Parameter(Mandatory = $true)][string]$BundlePath,
    [string]$JavaHome = $env:JAVA_HOME
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$signingProperties = ConvertFrom-StringData (Get-Content -LiteralPath (Join-Path $projectRoot '.secrets/play-signing.properties') -Raw)
$keytool = Join-Path $JavaHome 'bin/keytool.exe'
$env:KKOREA_VERIFY_PASSWORD = $signingProperties.storePassword
try {
    $keyInfo = (& $keytool '-J-Duser.language=en' -list -v -keystore (Join-Path $projectRoot '.secrets/play-upload.p12') `
        -storepass:env KKOREA_VERIFY_PASSWORD -alias $signingProperties.keyAlias | Out-String)
    if ($LASTEXITCODE -ne 0) { throw 'Cannot read upload certificate.' }
} finally { Remove-Item Env:KKOREA_VERIFY_PASSWORD -ErrorAction SilentlyContinue }
$bundleInfo = (& $keytool '-J-Duser.language=en' -printcert -jarfile $BundlePath | Out-String)
if ($LASTEXITCODE -ne 0) { throw 'Cannot read bundle signer certificate.' }
$expectedFingerprint = [regex]::Match($keyInfo, 'SHA256:\s*([A-F0-9:]+)').Groups[1].Value
$actualFingerprint = [regex]::Match($bundleInfo, 'SHA256:\s*([A-F0-9:]+)').Groups[1].Value
if (-not $expectedFingerprint -or $expectedFingerprint -ne $actualFingerprint) {
    throw 'Bundle signer does not match the preserved upload key.'
}
Write-Output "Upload certificate SHA-256 matches: $actualFingerprint"
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [IO.Compression.ZipFile]::OpenRead((Resolve-Path -LiteralPath $BundlePath).Path)
$checked = 0
try {
    foreach ($entry in $zip.Entries | Where-Object { $_.FullName -match '^base/lib/(arm64-v8a|x86_64)/.+\.so$' }) {
        $stream = $entry.Open()
        $memory = New-Object IO.MemoryStream
        try {
            $stream.CopyTo($memory)
            $bytes = $memory.ToArray()
        } finally { $stream.Dispose(); $memory.Dispose() }
        if ($bytes.Length -lt 64 -or $bytes[0] -ne 0x7f -or $bytes[1] -ne 0x45 -or
            $bytes[2] -ne 0x4c -or $bytes[3] -ne 0x46 -or $bytes[4] -ne 2 -or $bytes[5] -ne 1) {
            throw "Expected little-endian ELF64: $($entry.FullName)"
        }
        $headerOffset = [BitConverter]::ToUInt64($bytes, 32)
        $headerSize = [BitConverter]::ToUInt16($bytes, 54)
        $headerCount = [BitConverter]::ToUInt16($bytes, 56)
        $loads = 0
        for ($i = 0; $i -lt $headerCount; $i++) {
            $offset = [int]($headerOffset + $i * $headerSize)
            if ($offset + 56 -gt $bytes.Length) { throw "Invalid ELF headers: $($entry.FullName)" }
            if ([BitConverter]::ToUInt32($bytes, $offset) -eq 1) {
                $loads++
                $alignment = [BitConverter]::ToUInt64($bytes, $offset + 48)
                if ($alignment -lt 16384) {
                    throw "Native library has PT_LOAD alignment $alignment below 16 KB: $($entry.FullName)"
                }
            }
        }
        if ($loads -eq 0) { throw "No ELF load segments: $($entry.FullName)" }
        $checked++
    }
    if (-not $checked) { throw 'No 64-bit native libraries found in the React Native bundle.' }
    if (-not $zip.GetEntry('base/assets/index.android.bundle')) { throw 'Missing embedded JavaScript bundle.' }
} finally { $zip.Dispose() }
Write-Output "16 KB ELF PT_LOAD alignment verified for $checked native libraries; embedded JavaScript bundle present."
Write-Output 'This checks native ELF alignment, not device runtime behavior or APK ZIP alignment.'
