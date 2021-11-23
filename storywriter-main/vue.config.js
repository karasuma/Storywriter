module.exports = {
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                productName: "Storywriter",
                appId: "com.crowolf.storywriter",
                win: {
                    icon: 'src/assets/icon.ico',
                    target: [
                        {
                            target: 'portable',
                            arch: ['x64']
                        }
                    ]
                }
            }
        }
    }
}
