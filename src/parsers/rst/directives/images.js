import * as nodes from '../../../nodes';
import Directive from '../Directive';

class Image extends Directive {
    run() {
        return new nodes.comment('', 'test', [], {});
    }
}

export { Image };

