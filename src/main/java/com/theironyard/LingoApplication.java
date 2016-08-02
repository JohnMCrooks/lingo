package com.theironyard;

import com.theironyard.entities.Category;
import com.theironyard.entities.Dictionary;
import com.theironyard.entities.ResultContainter;
import com.theironyard.entities.Results;
import com.theironyard.services.ApiLookupService;
import com.theironyard.services.CategoryRepository;
import com.theironyard.services.DictionaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.concurrent.Future;


@SpringBootApplication
@EnableAsync
public class LingoApplication implements CommandLineRunner {

	@Autowired
	ApiLookupService apiLookupService;

	@Autowired
	DictionaryRepository dictionaries;

	@Autowired
	CategoryRepository categories;


	@Override
	public void run(String... args) throws Exception {
		long start = System.currentTimeMillis();
		boolean isRunning = true;

		// Every 24 hours scrape and translate articles from these 5 categories at the New York Times
		while(isRunning) {
			Future<ResultContainter> page1 = apiLookupService.findResults("https://api.nytimes.com/svc/topstories/v2/technology.json?api-key=289858bf10514c09b02e561994f4ab45");
			Future<ResultContainter> page2 = apiLookupService.findResults("https://api.nytimes.com/svc/topstories/v2/sports.json?api-key=289858bf10514c09b02e561994f4ab45");
			Future<ResultContainter> page3 = apiLookupService.findResults("https://api.nytimes.com/svc/topstories/v2/arts.json?api-key=289858bf10514c09b02e561994f4ab45");
			Future<ResultContainter> page4 = apiLookupService.findResults("https://api.nytimes.com/svc/topstories/v2/politics.json?api-key=289858bf10514c09b02e561994f4ab45");
			Future<ResultContainter> page5 = apiLookupService.findResults("https://api.nytimes.com/svc/topstories/v2/business.json?api-key=289858bf10514c09b02e561994f4ab45");
			Thread.sleep(86400000);
		}
	} //end run method

	public static void main(String[] args) throws IOException {
		SpringApplication.run(LingoApplication.class, args);
	}
}
