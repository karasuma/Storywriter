<template>
    <footer :style="backgroundCss">
        <div class="footer__sample" @click="openLog">{{ text }}</div>
    </footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { SystemMessage } from './models/system-message';
import exec from 'child_process';
import path from 'path';
import Logger from './models/logger';

@Options({
    props: {
        message: {
            type: SystemMessage,
            required: true
        }
    },
    methods: {
        openLog: function(): void {
            const fullpath = Logger.getLogFilePath();
            exec.exec(`start "" "${path.dirname(fullpath)}"`);
            exec.exec(fullpath);
        }
    },
    computed: {
        backgroundCss: function(): string {
            return `background-color: ${this.message.status};`;
        },
        text: function(): string {
            if(this.message.message.length == 0) {
                return "You are now floating on the sea of imagine..."
            }
            return this.message.message;
        }
    }
})

export default class EditFooter extends Vue {
    message!: SystemMessage;
}
</script>

<style lang="scss" scoped>
@import './templates/darktheme.scss';
@import './templates/common.scss';

footer {
    @include unselectable();
    position: fixed;
    bottom: -1px;
    left: 0;
    width: 100%;
    z-index: $Front-ZIndex;
    color: $Font-Color;

    padding: 3px 0;
    height: $Footer-Height;
    margin-top: auto;

    .footer__sample {
        font-size: 13px;
        padding: 0 18px;
        &:hover {
            text-decoration: underline;
            text-decoration-color: $Font-Color;
        }
    }
}
</style>