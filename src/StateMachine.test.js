import { StateMachine, StateWS, StringList } from './StateMachine';

class MockStateMachine {
    constructor(args)
    {
	if(!args.hasOwnProperty('runResult')) {
	    console.log(Object.keys(args));
	    throw new Error();
	}
	this.runResult = args.runResult;
    }
    run({ inputLines, inputOffset, context, inputSource, initialState}) {
	return this.runResult;
    }
}


test.skip('construct StateMachine', () => {
    try
    {
	const sot = new StateMachine({stateClasses:[]});
	sot.run(["test"]);
    } catch(error) {
	console.log(error.stack);
	console.log(error.message);
    }
    
});

test('StateWS indent', () => {
    const indented = new StringList([]);
    let indent = 2;
    let offset = 0;
    let blankFinish = true;
    class TestIndentStateMachine extends MockStateMachine {
	getIndented({start, untilBlank, stripIndent, blockIndent, firstIndent}) {
	    return [indented, indent, offset, blankFinish];
	}
    }

    const magicArray =  ['Magic array']
    const stateMachine = new TestIndentStateMachine({runResult: magicArray });
    const indentResult = ['Indent']

    const TestState = class extends StateWS {
	_init() {
	    super._init();
	    console.log('settig indentSmKwargs');
	    this.indentSmKwargs = { runResult: indentResult };
	    this.nestedSmKwargs = { runResult: indentResult }; // I think this needs stateclasses and oter stuff ???
	    this.indentSm = MockStateMachine;
	    this.nestedSm = MockStateMachine;
	}
    }
    const state = new TestState({ stateMachine,
				  debug: true });
    let match, context = [];
    const nextState = 'random';
    const r = state.indent(match,context,nextState)
    expect(r).toHaveLength(3)
    const [ resultContext, resultNextState, resultResults ] = r;
    expect(resultContext).toBe(context);
    expect(resultNextState).toBe(nextState);
    expect(resultResults).toBeDefined();
    expect(resultResults).toBe(indentResult);
    //    resultResults is the return value from the indent state machine
});
