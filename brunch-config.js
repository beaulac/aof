
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
            "plugins": ["transform-class-properties"]
        },
        less: {
            modules: true,
            'source-map': 'styles/application.css.map'
        }
    },

    hooks: {
        preCompile: (end) => {
            var fs = require('fs');

            var audioFiles = JSON.stringify(fs.readdirSync('app/assets/audio'));
            var jsLOL = "export const DEF_SAMPLES = ";          //wow such hack
            //fs.writeFileSync('app/components/graph/Samples.js', jsLOL + audioFiles);

            console.log("Found audio files: " + audioFiles);

            end();
        }
    }
};
