
export class ModalWindowModel {
    header: string;
    description: string;
    defaultName: string;
    // comand: number;

    constructor(header: string, description: string, defaultName: string){
        this.header = header;
        this.description = description;
        this.defaultName = defaultName;
    }

}
