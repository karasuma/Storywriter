export class SystemMessage {
    public static readonly MessageType = {
        Normal: "#6495ED",
        Warning: "#DAA520",
        Alert: "#B22222"
    } as const;

    public message: string = "";
    public status: string = SystemMessage.MessageType.Normal;

    public changeMessage(
        message: string,
        status: string = SystemMessage.MessageType.Normal): void
    {
        this.message = message;
        this.status = status;
    }
}

