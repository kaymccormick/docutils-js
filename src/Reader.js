import { Component } from './index';
import universal from './transforms/universal';
import parsers from './parsers';
import utils from './utils';

export default class Reader extends Component {
    getTransforms() {
	return [ /*...super.getTransforms()*/ universal.Decorations,
		 universal.ExportInternals, universal.StripComments ];
    }

    constructor(parser, parserName) {
	super(parser, parserName);
	this.componentType = 'reader';
	this.configSection = 'readers';
	this.parser = parser;
	if(parser === undefined && parserName) {
	    this.setParser(parserName);
	}
	this.source = undefined;
	this.input = undefined;
    }

    setParser(parserName) {
	const ParserClass = parsers.getParserClass(parserName).Parser;
	this.parser = new ParserClass({});
    }

    /**
      * Magic read method. Returns document. Clearly this is meant to read
      * the stream in its entirety?
      * we may have to change api semantics!
      */
    read(source, parser, settings, cb) {
	this.source = source;
	if(!this.parser) {
	    this.parser = parser;
	}
	this.settings = settings;
	if(!this.source) {
	    throw new AssertError("Need source");
	}

	this.source.read((error, data) =>
			 {
			     if(error) {
				 console.log(error.stack);
				 cb(error);
				 return;
			     }
			     this.input = data;
			     this.parse();
			     cb(undefined, this.document);
			 });
    }

    /* Delegates to this.parser, providing arguments
       based on instance variables */
    parse() {
	const document = this.newDocument({});
	this.document = document;
	if(!this.input) {
	    throw new Error("need input, i have " + this.input);
	}
	
	this.parser.parse(this.input, document);
	document.currentSource = document.currentLine = undefined;
    }

    newDocument() {
	const document = utils.newDocument({ sourcePath: this.source.sourcePath },
					   this.settings);
	return document;
    }
}
