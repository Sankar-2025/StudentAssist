# InternProof AI — Production Release Packager
param (
    [string]$OutputZip = "c:\Users\scher\OneDrive\Desktop\StudentAssist\internproof-ai-release.zip"
)

$sourceDir = "c:\Users\scher\OneDrive\Desktop\StudentAssist"
$stagingDir = Join-Path $env:TEMP ("internproof_pack_" + [System.Guid]::NewGuid().ToString().Substring(0,8))

Write-Host "Creating staging directory: $stagingDir"
New-Item -ItemType Directory -Path $stagingDir -Force | Out-Null

$excludeFolders = @('node_modules', 'dist', '.git', '.cache', 'coverage', '.system_generated')
$excludeFiles = @('.env', 'dev.db', 'dev.db-journal', '*.zip')

# Copy files excluding node_modules, build outputs, and secrets
Get-ChildItem -Path $sourceDir -Recurse | ForEach-Object {
    $item = $_
    $relPath = $item.FullName.Substring($sourceDir.Length + 1)
    
    # Check if inside excluded folder
    $skip = $false
    foreach ($ef in $excludeFolders) {
        if ($relPath -eq $ef -or $relPath.StartsWith($ef + "\") -or $relPath.Contains("\" + $ef + "\")) {
            $skip = $true
            break
        }
    }
    
    # Check if excluded file
    foreach ($efile in $excludeFiles) {
        if ($item.Name -like $efile) {
            $skip = $true
            break
        }
    }
    
    if (-not $skip) {
        $destPath = Join-Path $stagingDir $relPath
        if ($item.PSIsContainer) {
            if (-not (Test-Path $destPath)) {
                New-Item -ItemType Directory -Path $destPath -Force | Out-Null
            }
        } else {
            $destParent = Split-Path $destPath
            if (-not (Test-Path $destParent)) {
                New-Item -ItemType Directory -Path $destParent -Force | Out-Null
            }
            Copy-Item -Path $item.FullName -Destination $destPath -Force
        }
    }
}

if (Test-Path $OutputZip) {
    Remove-Item -Path $OutputZip -Force
}

Write-Host "Compressing to $OutputZip..."
Compress-Archive -Path "$stagingDir\*" -DestinationPath $OutputZip -CompressionLevel Optimal

Remove-Item -Recurse -Force $stagingDir
Write-Host "✅ Export created successfully at: $OutputZip"
Get-Item $OutputZip | Select-Object Name, Length, LastWriteTime
