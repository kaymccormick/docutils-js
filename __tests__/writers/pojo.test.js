import { Publisher } from '../../src/Core';
import { StringInput, StringOutput } from '../../src/io';
import baseSettings from '../../src/baseSettings';

const currentLogLines = [];

afterEach(() => {
    if (currentLogLines.length) {
//      console.log(currentLogLines.join('\n') + '\n');
        currentLogLines.length = 0;
    }
});

const defaultArgs = {
    readerName: 'standalone',
    parserName: 'restructuredtext',
    usage: '',
    description: '',
    enableExitStatus: true,
    writerName: 'pojo',
};

const defaultSettings = { ...baseSettings };

test('rst2pojo pipeline', () => {
    const settings = { ...defaultSettings };
    const args = { ...defaultArgs };

/* eslint-disable-next-line no-unused-vars */
    const debugFn = (msg) => {
//      console.log(msg);
//      currentLogLines.push(msg);
    };

    const { readerName, parserName, writerName } = args;
    const source = new StringInput({
 source: `Random test
===========
I like food.

`,
});

    const destination = new StringOutput({});
    const pub = new Publisher({
        source, destination, settings, debug: true, debugFn,
    });
    pub.setComponents(readerName, parserName, writerName);
    return new Promise((resolve, reject) => {
        pub.publish({}, (error) => {
            if (error) {
                reject(error);
                return;
            }
            expect(JSON.parse(destination.destination)).toMatchSnapshot();
            currentLogLines.length = 0;
            resolve();
        });
    });
});
