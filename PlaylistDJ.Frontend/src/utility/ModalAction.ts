export default class ModalAction {
    title: string
    onClick: Function
    display: boolean

    constructor(title: string, onClick: Function, display: boolean = true) {
        this.title = title
        this.onClick = onClick
        this.display = display
    }
}
