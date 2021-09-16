export class Defs {
    public static readonly MessageType = {
        None: 0,
        Confirm: 1,
        Reject: 2
    } as const;

    public static readonly definedColors: string[] = [
        "#434343", // Gray
        "#582020", // Red
        "#583b20", // Orange
        "#585520", // Yellow
        "#395820", // Light Green
        "#20582b", // Green
        "#205852", // Skyblue
        "#204158", // Waterblue
        "#202458", // Blue
        "#3f2058", // Violet
        "#58204f", // Cherry blossom
        "#582039", // Crimson
    ];
}
