/**
 * 主角的状态键，分别是：hp血条，money金钱，honor荣誉
 */
type StateKey = 'hp' | 'money' | 'honor';

/**
 * 主角状态，包括：
 * site：当前所在位置的ID
 * days：当前天数
 * 主角的状态键及其对应的数值
 */
interface State {
    site: string;
    days: number;
    [key: StateKey]: number;
}

/**
 * 游戏的操控，
 * 注：尽量不要直接修改state中的数值，而是使用mutate方法修改
 */
interface Game {
    // 尽量不要直接修改
    state: State;

    /**
     * 对原始字符串中的一些占位符进行替换：
     * $site 替换为 当前地点的名字
     * $ports 替换为 当前地点所有通路的名字列表
     * $days 替换为 当前生存天数
     * $hp、$money、$honor 分别替换为 当前血量、金钱、荣誉
     * @param raw 原始字符串
     * @returns 替换后的字符串
     */
    fillText(raw: string): string;

    /**
     * 向对话框添加文本，类型有：normal、event、good、bad、value-mutation
     * @param text 添加的文本
     * @param types 该文本的类型
     */
    addText(text: string, ...types: Array<string>): void;

    /**
     * 清空选项栏并设置新的选项
     * @param options 选项列表
     */
    setOptions(options: Array<Option>): void;

    /**
     * 修改主角的数值
     * @param key 主角的状态键
     * @param delta 变化量（而不是最终量）
     * @param reason 原因
     */
    mutate(key: StateKey, delta: number, reason?: string): void;

    /**
     * 走向一个指定的地点
     * @param siteId 目的地的ID
     * @param instantly 是否立刻到达，关闭即计算生存天数以及路上消耗的金钱，默认关闭
     */
    goToSite(siteId: string, instantly?: boolean): void;

    /**
     * 触发一个事件
     * @param event 事件的ID或者事件本身
     */
    triggerEvent(event: string | Event): void;

    /**
     * 显示人物信息与通路选项列表
     * @param state 是否显示当前状态、位置等信息，默认开启
     * @param options 是否更新当前地点的通路选项，默认开启
     */
    showState(state?: boolean, options?: boolean): void;
}

/**
 * 单个选项
 */
interface Option {
    // 文本，其占位符将会被自动替换
    text: string;
    // 行动，即按下该选项按钮后的行为
    action: string | Action;
}

/**
 * 单个事件，除了id必填外，有两种模式可选
 * 1.（推荐优先考虑）填写text、options字段，则会将text添加到对话框中，并设置选项
 * 2.填写action字段，则会直接执行该行动
 */
interface Event {
    // 事件的ID，尽量取一个简单明了的小写字母、数字、下划线组成的ID
    id: string;
    // 事件触发的权重，数值越大，越可能被触发，默认是0，即不会触发，除非这是唯一的事件
    weight?: number;
    // 文本
    text?: string;
    // 选项列表
    options?: Array<Option>;
    // 事件行为
    action?: Action;
}

/**
 * 一个游戏的行动
 */
type Action = (game: Game) => void; 

/**
 * 单个通路，在每个地点（Site）会有一些(也可能没有)通路通向其它地点
 */
interface Port {
    // 名字，如果为空则会显示：“去往”+目的地名字
    name?: string;
    // 目的地，是目的地的ID
    target?: string;
    // 若设置了action会在选择该选项时优先执行action
    action?: string | Action;
}

/**
 * 单个地点
 */
interface Site {
    // 唯一标识符ID
    id: string;
    // 地点名称
    name: string;
    // 地点通路
    ports: Array<Port>;
    // 进入地点后会立即从事件中根据权重选取一个并触发
    events: Array<Event>;
}

/**
 * 游戏数据，也就是脚本
 */
interface Data {
    // 所有的地点
    sites: Array<Site>;
    // 所有的事件
    events: Array<Event>;
    // 游戏入口
    entry: {
        // 初始所在的地点
        site: string;
        // 游戏的前情提要
        story: string;
    };
}

declare const DATA: Data;

declare const GAME: Game;
