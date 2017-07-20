from os import listdir
from os.path import isfile, join

SAMPLE_FILE_PATH = "../../assets/audio/"

onlyfiles=[f for f in listdir(SAMPLE_FILE_PATH) if isfile(join(SAMPLE_FILE_PATH, f))]

samples = "export const DEF_SAMPLES = \n["
num_files = 0
for i in range(0, len(onlyfiles)):
    if onlyfiles[i].endswith(".mp3"):
        num_files += 1
        if num_files > 1:
            samples += ", "
        samples += "\n\t\"" + onlyfiles[i] + "\""

samples += "\n]"

text_file = open("Samples.js", "w")
text_file.write(samples)
text_file.close()