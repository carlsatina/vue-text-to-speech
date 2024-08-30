
<template>
    <div>
      <div v-if="!speech.isSupported">
        Your browser does not support SpeechSynthesis API,
        <a
          href="https://caniuse.com/mdn-api_speechsynthesis"
          target="_blank"
        >more details</a>
      </div>
      <div v-else>
        <!-- <label class="font-bold mr-2">Spoken Text</label>
        <input v-model="text" class="!inline-block" type="text"> -->
  
        <p>Spelling Tests # {{ testNum }} of {{ maxTestNum }}</p>
        <p>Set time interval per word (in seconds)</p>
        <div class="form-group row justify-content-center">
            <div class="justify-content-center w-25">
                <input v-model="wordInterval" class="form-control" type="text">
            </div>
        </div>
        <br>
        <label class="font-bold mr-2">Language</label>
        <div class="form row justify-content-center">
          <select v-model="voice" class="form-control form-control-sm w-25">
            <option
              v-for="(voice, i) in voices"
              :key="i"
              :value="voice"
            >
              {{ `${voice.name} (${voice.lang})` }}
            </option>
          </select>
        </div>
  
        <br>
        <div class="mt-2">
          <button class="btn btn-primary"
            :disabled="speech.isPlaying.value"
            @click="play"
          >
            Begin Test
          </button>&nbsp;&nbsp;&nbsp;
          <button class="btn btn-danger" @click="stop">Stop</button>
        </div>
      </div>
    </div>
  </template>

<script lang="ts">
import { onMounted, ref } from "vue";
import { useSpeechSynthesis } from "@vueuse/core";

const voice = ref<SpeechSynthesisVoice>(undefined as unknown as SpeechSynthesisVoice)
const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms))

export default {
    name: "Home",
    setup() {

        const text = ref('Hello, everyone! Good morning!')
        const pitch = ref(1)
        const rate = ref(1)
        const wordInterval = ref(5)
        const test1 = ref([
            "Spelling",
            "Rainbow",
            "Cellphone",
            "Electric Fan",
            "Computer",
            "Television"
        ])
        const testNum = ref(0)
        const maxTestNum = test1.value.length
        var stopped = false

        const speech = useSpeechSynthesis(text, {
            voice,
            pitch,
            rate,
        })

        let synth: SpeechSynthesis
        const voices = ref<SpeechSynthesisVoice[]>([])

        onMounted(() => {

            if (speech.isSupported.value) {
            // load at last
                setTimeout(() => {
                synth = window.speechSynthesis
                voices.value = synth.getVoices()
                voice.value = voices.value[0]
                })
            }
        })

        const play = async () => {
            stopped = false
            if (speech.status.value === 'pause') {
                console.log('resume')
                window.speechSynthesis.resume()
            }
            else {
                testNum.value = 0
                var shuffle = test1.value.sort(() => Math.random() - 0.5)
                for (var t of shuffle) {
                    testNum.value++
                    text.value = t
                    speech.speak()
                    setTimeout(() => {
                        speech.speak()
                    }, 2000)

                    await delay(wordInterval.value * 1000)
                    if (stopped) {
                        break;
                    }
                }
            }
        }

        function pause() {
            window.speechSynthesis.pause()
        }

        function stop() {
            speech.stop()
            stopped = true
        }

        return {
            speech,
            play,
            pause,
            stop,
            rate,
            pitch,
            voices,
            text,
            voice,
            testNum,
            maxTestNum,
            wordInterval
        }
    }
}


</script>
