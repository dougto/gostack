import React, { useState, useEffect } from "react";
import api from './services/api';

import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories')
    .then(res => {
      setRepositories(res.data);
    });
  },[]);

  async function handleLikeRepository(id) {
    api.post(`repositories/${id}/like`)
    .then(res => {
      const index = repositories.findIndex(repository => repository.id === id);
      repositories[index] = res.data;
      setRepositories([...repositories]);
    });
  }

  function renderRepositories() {
    return repositories.map( repository => (
      <View key={repository.id} style={styles.repositoryContainer}>
        <Text style={styles.repository}>{repository.title}</Text>

        <View style={styles.techsContainer}>
          {repository.techs.map(tech => {
            const key = repository.techs.indexOf(tech);
            return (
            <Text key={key} style={styles.tech}>
              {tech}
            </Text>);
            }
          )}
        </View>

        <View style={styles.likesContainer}>
          <Text
            style={styles.likeText}
            // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
            testID={`repository-likes-${repository.id}`}
          >
            {repository.likes} curtidas
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLikeRepository(repository.id)}
          // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
          testID={`like-button-${repository.id}`}
        >
          <Text style={styles.buttonText}>Curtir</Text>
        </TouchableOpacity>
      </View>
    ));
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.list}>
          {renderRepositories()}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
  list: {
    flex: 1,
  },
});