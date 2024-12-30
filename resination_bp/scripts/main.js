import { world } from '@minecraft/server';

world.afterEvents.entityHurt.subscribe(e => {
    const { hurtEntity } = e
    const equippableComp = hurtEntity.getComponent('equippable')
    const item = equippableComp.getEquipment('Mainhand')
    if (item.typeId != 'luth_resination:resin_helmet') return
    item.typeId == 'luth_resination:resin_helmet_chipped'
    console.warn('the thing')
    equippableComp.setEquipment("Mainhand", item)
})