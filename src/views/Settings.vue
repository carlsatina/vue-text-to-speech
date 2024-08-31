<template>
    <div class="container">
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                Type the words to be added in the text box below and click Submit button
                <div class="input-group mb-3">
                    <input type="text" v-model="word" class="form-control" @keypress.enter="addWord" placeholder="Add a Word" aria-label="Add a Word" aria-describedby="button-addon2">
                    <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="addWord" >Submit</button>
                </div>
            </div>
            <div class="col-md-3"></div>
        </div>
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <p>There are {{ maxTestNum }} number of Words added.</p>
            </div>
            <div class="col-md-3"></div>
        </div>
    </div>
</template>


<script lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios"

export default {
    name: "Settings",
    setup() {
        const word = ref('')
        const addWord = async () => {
            const res = await axios.post(process.env.VUE_APP_JSON_SERVER + '/data', {
                spelling: word.value
            })
            word.value = ''
            maxTestNum.value++
        }
        const maxTestNum = ref(0)
        const allWords: any[] = []

        onMounted(async () => {

            const res = await axios.get(process.env.VUE_APP_JSON_SERVER + '/data')
            for (var x of res.data) {
                allWords.push(x.spelling)
            }
            maxTestNum.value = allWords.length
        })
        return {
            addWord,
            word,
            maxTestNum
        }
    }
}
</script>
