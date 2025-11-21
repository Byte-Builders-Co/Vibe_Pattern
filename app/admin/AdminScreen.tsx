import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function AdminScreen() {
  const [name, setName] = useState("");
  const [pattern, setPattern] = useState("");

  const generateJSON = () => {
    const arr = pattern.split(",").map((num) => Number(num.trim()));

    const jsonData = `
{
  "id": "${Date.now()}",
  "name": "${name}",
  "pattern": [${arr}]
}
    `.trim();

    alert("Copy this JSON entry:\n\n" + jsonData);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Create New Pattern</Text>

      <TextInput
        placeholder="Pattern Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginTop: 15, padding: 10 }}
      />

      <TextInput
        placeholder="100,200,300"
        value={pattern}
        onChangeText={setPattern}
        style={{ borderWidth: 1, marginTop: 15, padding: 10 }}
      />

      <Button title="Generate JSON Data" onPress={generateJSON} />
    </View>
  );
}
