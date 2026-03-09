# Copie les 4 photos de la galerie depuis le stockage Cursor vers le projet.
# Exécutez ce script dans PowerShell : .\copy-gallery.ps1

$cursorAssets = "$env:USERPROFILE\.cursor\projects\c-Users-malik-Downloads-Projets-vente-en-ligne\assets"
$dest = Join-Path $PSScriptRoot "public\gallery"

$sources = @(
  "c__Users_malik_AppData_Roaming_Cursor_User_workspaceStorage_808940159d709207aac41f1babf70705_images_WhatsApp_Image_2026-02-19_at_23.54.45__1_-4c284163-f29b-4421-be62-0e886892f596.png",
  "c__Users_malik_AppData_Roaming_Cursor_User_workspaceStorage_808940159d709207aac41f1babf70705_images_WhatsApp_Image_2026-02-19_at_23.54.45-1da87aae-9882-4283-9ea0-c1d8d1364e15.png",
  "c__Users_malik_AppData_Roaming_Cursor_User_workspaceStorage_808940159d709207aac41f1babf70705_images_WhatsApp_Image_2026-02-20_at_21.52.02-9c16a515-170e-416b-9999-21dc2f20a293.png",
  "c__Users_malik_AppData_Roaming_Cursor_User_workspaceStorage_808940159d709207aac41f1babf70705_images_WhatsApp_Image_2026-02-20_at_21.47.45-5f42751c-d1c2-4236-be61-a15300b527da.png"
)

New-Item -ItemType Directory -Force -Path $dest | Out-Null
$i = 1
foreach ($f in $sources) {
  $srcPath = Join-Path $cursorAssets $f
  if (Test-Path $srcPath) {
    Copy-Item -LiteralPath $srcPath -Destination (Join-Path $dest "gallery-$i.png")
    Write-Host "OK gallery-$i.png"
    $i++
  } else {
    Write-Host "Manquant: $f"
  }
}
if ($i -eq 5) { Write-Host "Les 4 images ont ete copiees dans public\gallery\" }
