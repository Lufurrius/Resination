import { world, ItemStack, GameMode, system } from '@minecraft/server';
import "./items/armour"
import * as util from "util.js"

const toolTypeIds = [
    'luth_resination:resin_pickaxe',
    'luth_resination:resin_axe',
    'luth_resination:resin_sword',
    'luth_resination:resin_hoe',
    'luth_resination:resin_shovel',

    'luth_resination:resin_pickaxe_chipped',
    'luth_resination:resin_axe_chipped',
    'luth_resination:resin_sword_chipped',
    'luth_resination:resin_hoe_chipped',
    'luth_resination:resin_shovel_chipped',

    'luth_resination:resin_pickaxe_cracked',
    'luth_resination:resin_axe_cracked',
    'luth_resination:resin_sword_cracked',
    'luth_resination:resin_hoe_cracked',
    'luth_resination:resin_shovel_cracked'
]

const weaponTypeIds = [
]

world.afterEvents.playerBreakBlock.subscribe(evd => {
    const { player, itemStackBeforeBreak: itemUsed } = evd

    if (!itemUsed || player.matches({ gameMode: GameMode.creative })) return

    if (toolTypeIds.includes(itemUsed.typeId) || weaponTypeIds.includes(itemUsed.typeId)) {
        const playerEquippableComp = player.getComponent("equippable")

        if (!playerEquippableComp) return

        const itemEnchantmentComp = itemUsed.getComponent("minecraft:enchantable")
        const unbreakingLevel = itemEnchantmentComp?.getEnchantment("unbreaking")?.level ?? 0

        const breakChance = 100 / (unbreakingLevel + 1)
        const randomizeChance = Math.random() * 100

        if (breakChance < randomizeChance) return

        const itemUsedDurabilityComp = itemUsed.getComponent("durability")

        if (!itemUsedDurabilityComp) return

        let durabilityModifier = 0
        if (toolTypeIds.includes(itemUsed.typeId)) {
            durabilityModifier = 1
        } else {
            durabilityModifier = 2
        }

        itemUsedDurabilityComp.damage += durabilityModifier

        const maxDurability = itemUsedDurabilityComp.maxDurability
        const currentDamage = itemUsedDurabilityComp.damage
        if (currentDamage >= maxDurability) {

            player.playSound('random.break', { pitch: 1, location: player.location, volume: 1 })
            playerEquippableComp.setEquipment("Mainhand", new ItemStack('minecraft:air', 1))
        }
        else if (currentDamage < maxDurability) {

            playerEquippableComp.setEquipment("Mainhand", itemUsed)
        }
    }
})


system.afterEvents.scriptEventReceive.subscribe(e => {
    const target = e.sourceEntity;

    if (e.id == "luth_resination:flash") {
        const sourceLocation = target.location
        target.dimension.playSound('random.glass', sourceLocation)
        target.dimension.getPlayers({ maxDistance: 16, location: sourceLocation }).forEach(player => {
            const targetLocation = player.location
            const distance = util.distance(targetLocation, sourceLocation)
            console.warn(distance)
            const power = ((1 - Math.min(16, distance) / 16), 1)
            player?.camera.fade({ fadeTime: { fadeInTime: 0, holdTime: power * 2, fadeOutTime: 3 }, fadeColor: { red: 1, green: 1, blue: 1 }, })
        })
    }
})