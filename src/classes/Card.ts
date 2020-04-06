export class Card {
    constructor(
        public value: string,
        public color: RGBAColor,
        public state: CardState
    ){}
}

// State object containing meta data of the state of on specific card
export interface CardState{
    //TODO: Stuff like position, orientation, active, heldByPlayer ... 
}