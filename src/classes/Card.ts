import { RGBAColor } from './RGBAColors'
export class Card {
    constructor(
        private value: string,
        private color: RGBAColor,
        public state: CardState
    ){}

    getValue(): string{
        return this.value;
    }

    getColor(): RGBAColor{
        return this.color;
    }
}

// State object containing meta data of the state of on specific card
export interface CardState{
    // TODO: Stuff like position, orientation, active, heldByPlayer ... 
}