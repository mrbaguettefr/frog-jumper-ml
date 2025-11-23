declare module 'neataptic' {
    export interface Architect {
        Perceptron(input: number, hidden: number | number[], output: number): any;
        Random(input: number, hidden: number | number[], output: number): any;
        LSTM(input: number, hidden: number | number[], output: number): any;
        GRU(input: number, hidden: number | number[], output: number): any;
        NARX(input: number, hidden: number | number[], output: number, previous: number): any;
        [key: string]: any;
    }

    export const architect: Architect;
    export const Network: any;
    export const methods: any;
    export const Connection: any;
    export const config: any;
    export const Group: any;
    export const Layer: any;
    export const Node: any;
    export const Neat: any;
    export const multi: any;
}

