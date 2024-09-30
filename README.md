# nodeIO 
a few proof of concept exercises to work with processing and importing file data.   

## io/csvImport 
import CSV file to postgres DB instance 

```
yarn run csvImport
``` 

drag specific formatted CSV file into `io/csvImport/temp/watch` 

(not very all purpose at the moment, requires a very specific CSV format)


## io/createMp3
auto-convert multiple WAV files to mp3 

```
yarn run createMp3
``` 

drag WAV files into `io/createMp3/temp/watch` 

* requires local install of [ffmpeg](https://www.ffmpeg.org)
