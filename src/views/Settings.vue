<template>
    <div>
        <div class="input-group mb-3">
            <input type="text" v-model="word" class="form-control" @keypress.enter="addWord" placeholder="Add a Word" aria-label="Add a Word" aria-describedby="button-addon2">
            <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="addWord" >Submit</button>
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
            const res = await axios.post('http://192.168.2.197:3000/data', {
                spelling: word.value
            })
            word.value = ''
        }

        return {
            addWord,
            word
        }
    }
}
</script>
