import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, Switch } from 'react-native';
import BottomSheet, { TouchableOpacity } from '@gorhom/bottom-sheet'
import { useFocusEffect } from "expo-router"

const displayDigits = (char: string, setNumber: any, setFormattedNumber: any, composedNumber: string) => {
    let newNumber = ''
    if (char === '-1') {
        const newComposedNumber = composedNumber.slice(0, composedNumber.length - 1)
        if (composedNumber === '0.') {
            newNumber = ''
        }
        else {
            if (newComposedNumber.at(newComposedNumber.length - 1) === '.') {
                newNumber = newComposedNumber.slice(0, newComposedNumber.length - 1)
            } else {
                newNumber = newComposedNumber
            }
        }
        if (newNumber === '0')
            newNumber = ''
        setNumber(newNumber)
        setFormattedNumber(numberFormatter(newNumber))
    } else if (composedNumber.length < 9) {
        if (composedNumber === '') {
            if (char === '.') {
                newNumber = '0' + char
            }
            else {
                newNumber = char
            }
        }
        else {
            if (char === '.') {
                if (composedNumber.indexOf('.') === -1) {
                    newNumber = composedNumber + char
                }
                else {
                    return
                }
            } else if (composedNumber === '0') {
                newNumber = char
            }
            else {
                if (composedNumber.slice(composedNumber.indexOf('.'), composedNumber.length - 1).length < 2)
                    newNumber = composedNumber + char
                else
                    return
            }
        }
        setNumber(newNumber)
        setFormattedNumber(numberFormatter(newNumber))
    }
}

const numberFormatter = (num: string) => {
    const rsIndex = num.indexOf('.')
    let rs = ''
    let ls = ''
    if (rsIndex === -1) {
        ls = num
    } else {
        ls = num.slice(0, rsIndex)
        rs = num.slice(rsIndex, num.length)
    }
    let builder = ''

    for (let i = ls.length - 1, j = 0; i >= 0; i--, j++) {

        if (j % 3 === 0 && j !== 0)
            builder = ls[i] + ',' + builder
        else
            builder = ls[i] + builder

    }

    return builder + rs

}

const NumPad = ({ setAmount }: any) => {
    const [number, setNumber] = useState('');
    const [formattedNumber, setFormattedNumber] = useState('');

    useFocusEffect(
        React.useCallback(() => {

            setAmount(number)

        }, [number])
    )


    return (
        <View style={{ flexDirection: 'column', marginVertical: 30, alignItems: 'center' }}>
            <Text style={{ fontSize: 50, fontWeight: number !== '' ? '500' : '100' }}>
                {number === '' ? '0 €' : formattedNumber + ' €'}</Text>
            <View style={{ flexDirection: 'row', marginTop: 150 }}>

                <TouchableOpacity
                    onPress={() => { displayDigits('1', setNumber, setFormattedNumber, number) }}
                    style={{ paddingHorizontal: 10 }}
                >
                    <Text style={{ fontSize: 30 }}>1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { displayDigits('2', setNumber, setFormattedNumber, number) }}
                    style={{ paddingHorizontal: 120 }}
                >
                    <Text style={{ fontSize: 30 }}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { displayDigits('3', setNumber, setFormattedNumber, number) }}
                    style={{ paddingHorizontal: 10 }}
                >
                    <Text style={{ fontSize: 30 }}>3</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 60 }}>
                <TouchableOpacity
                    onPress={() => { displayDigits('4', setNumber, setFormattedNumber, number) }}
                    style={{ paddingHorizontal: 10 }}
                >
                    <Text style={{ fontSize: 30 }}>4</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { displayDigits('5', setNumber, setFormattedNumber, number) }}
                    style={{ paddingHorizontal: 120 }}
                >
                    <Text style={{ fontSize: 30 }}>5</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { displayDigits('6', setNumber, setFormattedNumber, number) }}
                    style={{ paddingHorizontal: 10 }}
                >
                    <Text style={{ fontSize: 30 }}>6</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 60 }}>
                <TouchableOpacity
                    onPress={() => { displayDigits('7', setNumber, setFormattedNumber, number) }}
                    style={{ paddingHorizontal: 10 }}
                >
                    <Text style={{ fontSize: 30 }}>7</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { displayDigits('8', setNumber, setFormattedNumber, number) }}
                    style={{ paddingHorizontal: 120 }}
                >
                    <Text style={{ fontSize: 30 }}>8</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { displayDigits('9', setNumber, setFormattedNumber, number) }}
                    style={{ paddingHorizontal: 10 }}
                >
                    <Text style={{ fontSize: 30 }}>9</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 60 }}>
                <TouchableOpacity
                    onPress={() => { displayDigits('.', setNumber, setFormattedNumber, number) }}
                    style={{ paddingHorizontal: 10 }}
                >
                    <Text style={{ fontSize: 30 }}> .</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { displayDigits('0', setNumber, setFormattedNumber, number) }}
                    style={{ paddingHorizontal: 120 }}
                >
                    <Text style={{ fontSize: 30 }}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        displayDigits('-1', setNumber, setFormattedNumber, number)
                    }}
                    style={{ paddingHorizontal: 10 }}
                >
                    <Text style={{ fontSize: 30 }}> -</Text>
                </TouchableOpacity>
            </View>

        </View>

    )
};

export default NumPad;