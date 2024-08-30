
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
  
        <div>Spelling Tests # {{ testNum }} of {{ maxTestNum }}</div>
        <div class="form-group row justify-content-center">
            <span class="timer">{{ timer }}</span>
        </div>
        <div class="input-group row justify-content-center">
            <div class="">
                Set time interval per word (in seconds)
            </div>
            <div class="justify-content-center w-25">
                <input v-model="wordInterval" class="form-control form-control-sm" type="text">
            </div>
        </div>
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
import axios from "axios"

const voice = ref<SpeechSynthesisVoice>(undefined as unknown as SpeechSynthesisVoice)
const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms))

export default {
    name: "Home",
    setup() {

        const text = ref('Hello, everyone! Good morning!')
        const pitch = ref(1)
        const rate = ref(1)
        const wordInterval = ref(10)
        const test1 = ref([
            "Spelling",
            "Rainbow",
            "Cellphone",
            "Electric Fan",
            "Computer",
            "Television"
        ])
        const test2: any[] = []
        const testNum = ref(0)
        const maxTestNum = ref(0)
        const timer =ref (0)
        var stopped = false
        var myTimer;

        const speech = useSpeechSynthesis(text, {
            voice,
            pitch,
            rate,
        })

        let synth: SpeechSynthesis
        const voices = ref<SpeechSynthesisVoice[]>([])

        onMounted(async () => {

            const res = await axios.get('http://192.168.2.197:3000/data')
            for (var x of res.data) {
                test2.push(x.spelling)
            }
            maxTestNum.value = test2.length
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
            testNum.value = 0
            var shuffle = test2.sort(() => Math.random() - 0.5)
            for (var t of shuffle) {
                testNum.value++
                text.value = t
                speech.speak()
                await delay(2000)
                speech.speak()
                timer.value = 0

                myTimer = setInterval(() => {
                    timer.value++
                }, 1000)

                await delay(wordInterval.value * 1000)
                if (stopped) {
                    timer.value = 0
                    clearInterval(myTimer)
                    break;
                }
                clearInterval(myTimer)
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
            wordInterval,
            timer
        }
    }
}


</script>

<style>
.timer {
    font-size: 100px;
}
</style>