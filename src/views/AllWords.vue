<template>
    <div class="container">
        <div class="row">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <table class="table table-sm table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Word</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="entry in allWords">
                            <td>{{ entry.spelling }}</td>
                            <td>
                                <button type="button" class="btn btn-info btn-sm">Edit</button>&nbsp;
                                <button type=button class="btn btn-danger btn-sm" @click="removeItem(entry.id)">Delete</button>

                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-md-3"></div>
        </div>
    </div>
</template>


<script>
import { onMounted, ref } from "vue";
import axios from "axios"
import addWord from '@/composables/addWord'
import getAllWords from '@/composables/getAllWords'
import deleteWord from '@/composables/deleteWord'
import { useRouter } from 'vue-router'

export default {
    name: "AllWords",
    setup() {
        const word = ref('')
        const maxTestNum = ref(0)
        let allWords = ref([])
        const router = useRouter()

        const removeItem = async (id) => {
            const res = await deleteWord(id)
            router.go()
        }
        onMounted(async () => {

            const res = await getAllWords()
            for (var x of res.data) {
                allWords.value.push(x)
            }
            maxTestNum.value = allWords.value.length
        })

        return {
            allWords,
            maxTestNum,
            removeItem
        }
    }
}
</script>
