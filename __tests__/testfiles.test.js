import { Publisher } from '../src/Core';
import { StringInput, StringOutput } from '../src/io';
import * as nodes from '../src/nodes';
import baseSettings from '../src/baseSettings';

const path = require('path');
const fs = require('fs');
const micromatch = require('micromatch');

const testFilesRoot = path.join(__dirname, '../testfiles/forms/');
//const glob = path.join(__dirname, '../testfiles/forms/*.txt');
// for files we want to return the files
// dor directories we want to return the directories

fs.readdirSync(restFilesRoot, { withFileTypes: true }).filter(e => e.isDirectory)

const files = micromatch([glob]);
const table = files.map(file => ([file, fs.readFileSync(file, 'utf-8')]));

const defaultArgs = {
    readerName: 'standalone',
    parserName: 'restructuredtext',
    usage: '',
    description: '',
    enableExitStatus: true,
    writerName: 'xml',
};

const defaultSettings = { ...baseSettings };

test.each(table)('%s', (file, input) => {
    const myOpts = {};

    const settings = { ...defaultSettings };
    const args = { ...defaultArgs };

    const { readerName, parserName, writerName } = args;
    const source = new StringInput({ source: input });
    const destination = new StringOutput({});
    const pub = new Publisher({
        source, destination, settings,
    });
    pub.setComponents(readerName, parserName, writerName);
    return new Promise((resolve, reject) => {
        /* {argv, usage, description, settingsSpec,
           settingsOverrides, configSection, enableExitStatus } */
        const fn = () => pub.publish({}, (error) => {
            if (error) {
                if (myOpts.expectError) {
                    resolve();
                } else {
                    reject(error);
                }
                return;
            }
            const document = pub.document;

            const Visitor = class extends nodes.GenericNodeVisitor {
                /* eslint-disable-next-line camelcase,no-unused-vars */
                default_departure(node) {
                    /**/
                }

                /* eslint-disable-next-line camelcase */
                default_visit(node) {
                    if (node.attributes && node.attributes.refuri) {
                        //                                console.log(node.attributes.refuri);
                        if (!/^https?:\/\//.test(node.attributes.refuri)) {
                            const msg = `Invalid refuri ${node.attributes.refuri}`;
                            const messages = [document.reporter.warning(msg, [], {})];
                            node.add(messages);
                        }
                    }
                }
            };
            const visitor = new Visitor(document);
            document.walkabout(visitor);
            expect(destination.destination).toMatchSnapshot();
            resolve();
        });
        fn();
    });
});
