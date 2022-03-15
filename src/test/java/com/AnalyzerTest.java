package com;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;


@SpringBootTest
public class AnalyzerTest {


    @Autowired
    private Environment environment;


    @BeforeEach
    void init() {

    }


    @Test
    void giveNameAndValueInputs_returnResponse1() {

    }

}