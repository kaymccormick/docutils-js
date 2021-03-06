import StateMachineWS from '../../StateMachineWS';

class NestedStateMachine extends StateMachineWS {
    run({
 inputLines, inputOffset, memo, node, matchTitles,
    }) {
        /* istanbul ignore if */
        if (!inputLines) {
            throw new Error('need inputlines');
        }

        /* istanbul ignore if */
        if (matchTitles === undefined) {
            this.matchTitles = true;
        } else {
            this.matchTitles = matchTitles;
        }
        this.memo = memo;
        this.document = memo.document;
        /* istanbul ignore if */
        if (!this.document) {
            throw new Error('need document');
        }

        this.attachObserver(this.document.noteSource.bind(this.document));
        this.reporter = memo.reporter;
        this.language = memo.language;
        this.node = node;
        const results = super.run({ inputLines, inputOffset });
        /* istanbul ignore if */
        if (results === undefined) {
            throw new Error();
        }
        return results;
    }
}


export default NestedStateMachine;
