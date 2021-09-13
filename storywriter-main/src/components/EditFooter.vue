<template>
    <footer>
        <div class="footer__sample" v-bind:style="{ backgroundColor: background }">{{ message }}</div>
    </footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

const NotifyColors = {
    Info: "#6495ED",
    Warn: "#DAA520",
    Fatal: "#B22222"
} as const

@Options({
    props: {
        message: {
            type: String,
            default: "Ready."
        },
        background: {
            type: String,
            default: NotifyColors.Info
        }
    },
    methods: {
        changeStatus: function(msg: String, color: String) {
            if(msg.length > 0) {
                this.message = msg;
            }
            this.background = color;
        }
    }
})

export default class EditFooter extends Vue {
    message!: String;
    background!: String;
}
</script>

<style lang="scss" scoped>
@import './templates/darktheme.scss';
@import './templates/common.scss';

footer {
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
    }
}
</style>