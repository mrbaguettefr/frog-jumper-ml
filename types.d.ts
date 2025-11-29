export interface SynapticNeuronTraceJSONFormat {
    elegibility: Record<number, number>;
    extended: Record<number, Record<number, number>>;
}

export interface SynapticNeuronJSONFormat {
    trace: SynapticNeuronTraceJSONFormat;
    state: number;
    old: number;
    activation: number;
    bias: number;
    layer: string | number;
    squash: string | null;
}

export interface SynapticConnectionJSONFormat {
    from: number;
    to: number;
    weight: number;
    gater: number | null;
}

export interface SynapticNetworkJSONFormat {
    neurons: SynapticNeuronJSONFormat[];
    connections: SynapticConnectionJSONFormat[];
}

declare module "synaptic" {
    interface Network {
        toJSON(): SynapticNetworkJSONFormat;
    }

    namespace Network {
        function fromJSON(json: SynapticNetworkJSONFormat): Network;
    }
}
