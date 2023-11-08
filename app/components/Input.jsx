import { React, useState } from "react"
import { TextInput, StyleSheet } from "react-native"

const InputBox = ({keyboardType}) => {
    const [text, setText] = useState(0)
    return(
        <TextInput 
            style={styles.input}
            onChangeText={setText}
            value={text.toString()}
            keyboardType={keyboardType}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    }
})


export default InputBox