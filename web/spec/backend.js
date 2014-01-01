(glu.ns('tc')).createMockBackend = function(auto, recordNum) {
    var cancerTypes = [{
        "name": "Anal",
        "value": "anal"
    }, {
        "name": "Bladder",
        "value": "bladder"
    }, {
        "name": "Brain/CNS",
        "value": "brain"
    }, {
        "name": "Breast",
        "value": "breast"
    }, {
        "name": "Carcinoid",
        "value": "carcinoid"
    }, {
        "name": "Cervix",
        "value": "cervix"
    }, {
        "name": "Colorectal",
        "value": "colorectal"
    }, {
        "name": "Esophageal",
        "value": "esophageal"
    }, {
        "name": "Eye",
        "value": "eye"
    }, {
        "name": "Gastric",
        "value": "gastric"
    }, {
        "name": "Hepatic",
        "value": "hepatic"
    }, {
        "name": "Head",
        "value": "head"
    }, {
        "name": "Lung",
        "value": "lung"
    }, {
        "name": "Lymphoma",
        "value": "lymphoma"
    }, {
        "name": "Melanoma",
        "value": "melanoma"
    }, {
        "name": "Mesothelioma",
        "value": "mesothelioma"
    }, {
        "name": "Ovarian",
        "value": "ovarian"
    }, {
        "name": "Pancreatic",
        "value": "pancreatic"
    }, {
        "name": "Pediatric",
        "value": "pediatric"
    }, {
        "name": "Pituitary",
        "value": "pituitary"
    }, {
        "name": "Prostate",
        "value": "prostate"
    }, {
        "name": "Renal",
        "value": "renal"
    }, {
        "name": "Skin",
        "value": "skin"
    }, {
        "name": "Thyroid",
        "value": "thyroid"
    }, {
        "name": "Uterus",
        "value": "uterus"
    }, {
        "name": "Leukemia",
        "value": "acuteLymphoblasticLeukemia"
    }, {
        "name": "Vulvar",
        "value": "vulvar"
    }, {
        "name": "Salivary",
        "value": "salivary"
    }, {
        "name": "Sarcoma",
        "value": "sarcoma"
    }, {
        "name": "Testicular",
        "value": "testicular"
    }, {
        "name": "Unknown Origin",
        "value": "unknownOrigin"
    }],
        backend = glu.test.createBackend({
            defaultRoot: '/json/',
            fallbackToAjax: auto,
            autoRespond: auto,
            routes: [{
                name: 'cancerTypes',
                url: '/json/cancersites',
                handle: function(req) {
                    return cancerTypes
                }
            }, {
                name: 'siteMeta',
                url: '/json/sitemeta',
                handle: function(req) {
                    return {
                        "clinicaltrialCount": 53895
                    }
                }
            }, {
                name: 'molecularSubTypes',
                url: '/json/genes',
                handle: function(req) {
                    if (req.params.diseaseType == 'lung') return [{
                        name: 'something'
                    }]
                    else return []
                }
            }, {
                name: 'login',
                url: '/json/sessions',
                handle: function(req) {
                    if (req.params.email == 'test' && req.params.password == 'admin') {
                        authenticatedUser = {
                            name: 'Admin',
                            type: 'admin'
                        }
                        return {}
                    } else if (req.params.email == 'test' && req.params.password == 'patient') {
                        authenticatedUser = {
                            name: 'Patient',
                            type: 'patient'
                        }
                        return {}
                    } else {
                        authenticatedUser = {
                            error: 'Authentication Failure'
                        }
                        return authenticatedUser
                    }
                }
            }, {
                name: 'logout',
                url: '/json/sessions/action/delete',
                handle: function(req) {
                    return {
                        success: true
                    }
                }
            }, {
                name: 'users',
                url: '/json/users',
                handle: function(req) {
                    return {
                        success: true,
                        rows: [{
                            name: 'Test'
                        }],
                        total: 1
                    }
                }
            }, {
                name: 'user',
                url: '/json/user',
                handle: function(req) {
                    return authenticatedUser
                }
            }, {
                name: 'facets',
                url: '/json/clinicaltrials/facetsearch',
                handle: function(req) {
                    return {
                        success: true,
                        took: 285,
                        timed_out: false,
                        _shards: {
                            total: 5,
                            successful: 5,
                            failed: 0
                        },
                        hits: {
                            total: 0,
                            max_score: null,
                            hits: []
                        },
                        facets: {
                            keyword: {
                                _type: 'terms',
                                missing: 0,
                                total: 0,
                                other: 0,
                                terms: [{
                                    term: 'COPD',
                                    count: 690
                                }, {
                                    term: 'Asthma',
                                    count: 568
                                }, {
                                    term: 'stage IIIB non - small cell lung cancer',
                                    count: 377
                                }, {
                                    term: 'NSCLC',
                                    count: 363
                                }, {
                                    term: 'stage IV non - small cell lung cancer',
                                    count: 349
                                }, {
                                    term: 'recurrent non - small cell lung cancer',
                                    count: 327
                                }, {
                                    term: 'stage IV colon cancer',
                                    count: 326
                                }, {
                                    term: 'stage IV rectal cancer',
                                    count: 297
                                }, {
                                    term: 'recurrent colon cancer',
                                    count: 295
                                }, {
                                    term: 'asthma',
                                    count: 272
                                }, {
                                    term: 'recurrent rectal cancer',
                                    count: 270
                                }, {
                                    term: 'stage IIIA non - small cell lung cancer',
                                    count: 239
                                }, {
                                    term: 'Lung Cancer',
                                    count: 227
                                }, {
                                    term: 'adenocarcinoma of the rectum',
                                    count: 183
                                }, {
                                    term: 'adenocarcinoma of the colon',
                                    count: 142
                                }, {
                                    term: 'lung cancer',
                                    count: 140
                                }, {
                                    term: 'non - small cell lung cancer',
                                    count: 122
                                }, {
                                    term: 'stage III rectal cancer',
                                    count: 108
                                }, {
                                    term: 'stage III colon cancer',
                                    count: 106
                                }, {
                                    term: 'colorectal cancer',
                                    count: 105
                                }]
                            }
                        }
                    }
                }
            }, {
                name: 'exfacets',
                url: '/json/clinicaltrials/exfacetsearch',
                handle: function(req) {
                    return {
                        success: true,
                        took: 285,
                        timed_out: false,
                        _shards: {
                            total: 5,
                            successful: 5,
                            failed: 0
                        },
                        hits: {
                            total: 0,
                            max_score: null,
                            hits: []
                        },
                        facets: {
                            keyword: {
                                _type: 'terms',
                                missing: 0,
                                total: 0,
                                other: 0,
                                terms: [{
                                    term: 'COPD',
                                    count: 690
                                }, {
                                    term: 'Asthma',
                                    count: 568
                                }, {
                                    term: 'stage IIIB non - small cell lung cancer',
                                    count: 377
                                }, {
                                    term: 'NSCLC',
                                    count: 363
                                }, {
                                    term: 'stage IV non - small cell lung cancer',
                                    count: 349
                                }, {
                                    term: 'recurrent non - small cell lung cancer',
                                    count: 327
                                }, {
                                    term: 'stage IV colon cancer',
                                    count: 326
                                }, {
                                    term: 'stage IV rectal cancer',
                                    count: 297
                                }, {
                                    term: 'recurrent colon cancer',
                                    count: 295
                                }, {
                                    term: 'asthma',
                                    count: 272
                                }, {
                                    term: 'recurrent rectal cancer',
                                    count: 270
                                }, {
                                    term: 'stage IIIA non - small cell lung cancer',
                                    count: 239
                                }, {
                                    term: 'Lung Cancer',
                                    count: 227
                                }, {
                                    term: 'adenocarcinoma of the rectum',
                                    count: 183
                                }, {
                                    term: 'adenocarcinoma of the colon',
                                    count: 142
                                }, {
                                    term: 'lung cancer',
                                    count: 140
                                }, {
                                    term: 'non - small cell lung cancer',
                                    count: 122
                                }, {
                                    term: 'stage III rectal cancer',
                                    count: 108
                                }, {
                                    term: 'stage III colon cancer',
                                    count: 106
                                }, {
                                    term: 'colorectal cancer',
                                    count: 105
                                }]
                            }
                        }
                    }
                }
            }, {
                name: 'search',
                url: '/json/clinicaltrials/search',
                handle: function(req) {
                    return {
                        success: true,
                        hits: [{
                            _id: "32a54ee5-8525-43bc-886e-52fbf0353108",
                            _index: "clinicaltrialindex",
                            _score: 31,
                            _source: {
                                briefSummary: "      A trial in which patients over 18 years of age who are hospitalized with community acquired      pneumonia and are otherwise eligible for entry into the study are randomly selected to      receive one of two treatment regimens. After written informed consent is obtained, patients      will receive one of the following two treatment regimens: 1) intravenous administration of      azithromycin and ceftriaxone followed by azithromycin tablets, or 2) intravenous      administration of levofloxacin followed by levofloxacin tablets. At least four study visits      are normally conducted up to approximately one month after starting therapy. The objective      of this study is to compare the safety and efficacy of the two treatment regimens.    ",
                                briefTitle: "Intravenous Azithromycin Plus Intravenous Ceftriaxone Followed by Oral Azithromycin With Intravenous Levofloxacin Followed by Oral Levofloxacin for the Treatment of Moderate to Severely Ill Hospitalized Patients With Community Acquired Pneumonia"
                            }
                        }],
                        total: 1
                    }
                }
            }, {
                name: 'cancersearch',
                url: '/json/cancerdrugs/search',
                handle: function(req) {
                    return {
                        "hits": [{
                            "_source": {
                                "type": "fdadrug",
                                "title": "Abraxane",
                                "status": "Approved"
                            }
                        }, {
                            "_source": {
                                "type": "fdadrug",
                                "title": "Alimta",
                                "status": "Approved"
                            }
                        }, {
                            "_source": {
                                "type": "fdadrug",
                                "title": "Avastin",
                                "status": "Approved"
                            }
                        }, {
                            "_source": {
                                "type": "fdadrug",
                                "title": "Crizotinib",
                                "status": "Approved"
                            }
                        }, {
                            "_source": {
                                "type": "fdadrug",
                                "title": "Erlotinib",
                                "status": "Approved"
                            }
                        }, {
                            "_source": {
                                "type": "fdadrug",
                                "title": "Gefitinib",
                                "status": "Approved"
                            }
                        }, {
                            "_source": {
                                "type": "fdadrug",
                                "title": "Gemzar",
                                "status": "Approved"
                            }
                        }, {
                            "_source": {
                                "type": "fdadrug",
                                "title": "Hycamtin",
                                "status": "Approved"
                            }
                        }]
                    }
                }
            }, {
                name: 'intents',
                url: '/json/intents/search',
                handle: function(req) {
                    return {
                        term: 'Erlotinib',
                        facet: 'DRUG',
                        facetType: 'include'
                    }
                }
            }, {
                name: 'trials',
                url: '/trialadmin/trials',
                handle: function(req) {
                    return {
                        success: true,
                        records: [{
                            id: '123',
                            name: 'Trial 1'
                        }, {
                            id: '234',
                            name: 'Trial 2'
                        }]
                    }
                }
            }]
        });
    backend.capture();
    return backend;
};