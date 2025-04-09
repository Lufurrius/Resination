import { world, system } from '@minecraft/server';

world.afterEvents.entityHurt.subscribe(e => {
    const { hurtEntity, damage } = e

    const equipable = hurtEntity.getComponent('equippable')
    if (!equipable) return

    const equipmentSlots = ['Head', 'Chest', 'Legs', 'Feet']
    const resinItems = [
        'luth_resination:resin_helmet',
        'luth_resination:resin_chestplate',
        'luth_resination:resin_leggings',
        'luth_resination:resin_boots',
    ]

    const restoreRating = equipmentSlots.reduce((rating, slot, index) => {
        const item = equipable.getEquipment(slot)
        return rating + (item?.typeId === resinItems[index] ? 1 : 0)
    }, 0) / 5

    if (restoreRating === 0) return

    const healthComponent = hurtEntity.getComponent('health')
    if (!healthComponent) return

    const oldHealth = healthComponent.currentValue + damage
    if (oldHealth < 10) return
    const totalHealing = Math.floor(restoreRating * (oldHealth / 20) * damage)

    if (totalHealing <= 0) return

    const duration = 40
    const steps = totalHealing
    const curve = Array.from({ length: steps }, (_, i) => Math.sin((i + 1) / steps * (Math.PI / 2)))

    const intervals = curve.map(value => value * (duration / curve.reduce((a, b) => a + b, 0)))

    let step = 0
    const healStep = () => {
        if (step >= steps) return

        const healthComponent = hurtEntity.getComponent('health')
        if (!healthComponent) return

        healthComponent.setCurrentValue(
            Math.min(
                healthComponent.currentValue + 1,
                healthComponent.effectiveMax
            )
        )

        if (step < steps - 1) {
            system.runTimeout(healStep, intervals[step])
        }
        step++
    }

    healStep()
})

