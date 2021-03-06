import Component from './Component';
import { UnimplementedError } from './Exceptions';

class Parser extends Component {
    constructor(args) {
        super(args);
        this.componentType = 'parser';
        this.configSection = 'parsers';
        this.debug = args.debug;
        this.debugFn = args.debugFn;
    }

    /* istanbul ignore function */
    /* eslint-disable-next-line no-unused-vars */
    parse(inputstring, document) {
        throw new UnimplementedError('subclass implement parse');
    }

    /* eslint-disable-next-line no-unused-vars */
    setupParse(inputstring, document) {
    }

    finishParse() {
    }
}

export default Parser;
