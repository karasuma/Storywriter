export class Calendar {
    public Group = 0;
    public Index = 0;

    public setId(id: [string | number, string | number]) {
        // Set group
        if(typeof id[0] === 'string') {
            this.Group = parseInt(id[0]);
        } else {
            this.Group = id[0];
        }
        
        // Set index
        if(typeof id[1] === 'string') {
            this.Index = parseInt(id[1]);
        } else {
            this.Index = id[1];
        }
    }
}