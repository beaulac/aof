module.exports = {
    files: {

        javascripts: {
            joinTo: {
                'vendor.js': /^(?!app)/,
                'app.js': /^app/
            }
        },
        stylesheets: {joinTo: 'app.css'}
    },

    plugins: {
        babel: {
            presets: ['es2015', 'es2016', 'react'],
            'plugins': ['transform-class-properties']
        }
    },

    hooks: {
        preCompile: (end) => {
            const fs = require('fs');

            const audioFileRegex = /(.mp3$)|(.ogg$)|(.wav$)|(.m4a$)/;

            const audioFiles = JSON.stringify(
                fs.readdirSync('app/assets/audio')
                  .filter(filename => audioFileRegex.test(filename))
            );

            const jsLOL = 'export const DEF_SAMPLES = ';          //wow such hack
            fs.writeFileSync('app/components/graph/Samples.js', jsLOL + audioFiles);

            console.log('Found audio files: ' + audioFiles);

            end();
        }
    }
};
