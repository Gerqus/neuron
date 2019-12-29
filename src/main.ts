import { NetworkSchema, Network } from "./classes/Network.class";
import { ActivationFunctions } from "./libs/activationFunctions";

const networkSchema: NetworkSchema = [
    [
        {
            activationFunctions: [ActivationFunctions.bypass],
            bias: 0
        },
        {
            activationFunctions: [ActivationFunctions.bypass],
            bias: 0
        },
    ],
    [
        {
            activationFunctions: [ActivationFunctions.sigmoid],
        },
        {
            activationFunctions: [ActivationFunctions.sigmoid],
        },
    ],[
        {
            activationFunctions: [ActivationFunctions.sigmoid],
        },
    ],
];

new Network(networkSchema);