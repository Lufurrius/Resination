@echo off
:: Paths to repo and dev folders
set BEHAVIOR_PACK=C:\Users\lutho\Documents\GitHub\Resination\resination_bp
set RESOURCE_PACK=C:\Users\lutho\Documents\GitHub\Resination\resination_rp
set MINECRAFT_BEHAVIOR_PACK=C:\Users\lutho\Documents\Software\MCBESwitcher+\Profiles\Lufurrius\development_behavior_packs\Resination
set MINECRAFT_RESOURCE_PACK=C:\Users\lutho\Documents\Software\MCBESwitcher+\Profiles\Lufurrius\development_resource_packs\Resination

:: Copy and mirror packs
robocopy "%BEHAVIOR_PACK%" "%MINECRAFT_BEHAVIOR_PACK%" /MIR
robocopy "%RESOURCE_PACK%" "%MINECRAFT_RESOURCE_PACK%" /MIR

echo Sync complete!