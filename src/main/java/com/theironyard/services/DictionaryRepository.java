package com.theironyard.services;

import com.theironyard.entities.Dictionary;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DictionaryRepository extends CrudRepository<Dictionary, Integer> {
   Dictionary findByEnglish(String word);
}
