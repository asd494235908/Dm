import { Textarea,Divider,ConfigProvider, Pagination, Select, DatePicker, Radio, Upload, Avatar, Steps, Tooltip, Statistic, Button, Input, Checkbox, Breadcrumb, Carousel, Modal, InputNumber, Spin, BackTop, Popconfirm, Switch, Cascader, Tabs } from 'ant-design-vue'

const ant = {
    install(Vue) {
        Vue.component(Divider.name, Divider)
        Vue.component(ConfigProvider.name, ConfigProvider)
        Vue.component(Pagination.name, Pagination)
        Vue.component(Select.name, Select)
        Vue.component(Select.Option.displayName, Select.Option)
        Vue.component(DatePicker.name, DatePicker)
        Vue.component(Radio.Group.name, Radio.Group)
        Vue.component(Upload.name, Upload)
        Vue.component(Avatar.name, Avatar)
        Vue.component(Steps.name, Steps)
        Vue.component(Steps.Step.name, Steps.Step)
        Vue.component(Tooltip.name, Tooltip)
        Vue.component(Statistic.Countdown.name, Statistic.Countdown)
        Vue.component(Tabs.name, Tabs)
        Vue.component(Tabs.TabPane.name, Tabs.TabPane)
        Vue.component(Cascader.name, Cascader)
        Vue.component(Switch.name, Switch)
        Vue.component(Checkbox.Group.name, Checkbox.Group)
        Vue.component(BackTop.name, BackTop)
        Vue.component(Button.name, Button)
        Vue.component(Spin.name, Spin)
        Vue.component(Input.name, Input)
        Vue.component(Input.TextArea.name, Input.TextArea)
        Vue.component(Input.Search.name, Input.Search)
        Vue.component(InputNumber.name, InputNumber)
        Vue.component(Input.Password.name, Input.Password)
        Vue.component(Checkbox.name, Checkbox)
        Vue.component(Breadcrumb, Breadcrumb)
        Vue.component(Breadcrumb.item, Breadcrumb.item)
        Vue.component(Carousel.name, Carousel)
        Vue.component(Modal.name, Modal)
        Vue.component(Popconfirm.name, Popconfirm);
    }
}
export default ant