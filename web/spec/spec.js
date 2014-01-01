Given('the main page is loaded', function() {
    var backend, vm;

    Meaning(function() {
        glu.setTestMode()
        backend = tc.createMockBackend()
        vm = glu.model('tc.Main')
        vm.init()
    })

    ShouldHave('created a new view model', function() {
        expect(vm).toBeDefined()
    })

    ShouldHave('a guest user or no user defined', function() {
        expect(vm.user).toBe(null)
    })

    ShouldHave('the landing page currently displayed', function() {
        expect(vm.currentScreen).toNotBe(null)
        expect(vm.currentScreen.viewmodelName).toBe('Landing')
    })

    ShouldHave('loaded the cancer types', function() {
        expect(backend.getRequestsFor('cancerTypes').length).toBe(1);
        backend.respondTo('cancerTypes')
        expect(vm.cancerTypeStore.getCount()).toBeGreaterThan(0)
    })

    ShouldHave('blank email', function() {
        expect(vm.email).toBe('')
    })

    ShouldHave('blank password', function() {
        expect(vm.password).toBe('')
    })

    ShouldHave('logout button hidden', function() {
        expect(vm.logoutIsVisible).toBe(false)
    })

    ShouldHave('login button should be visible', function() {
        expect(vm.loginIsVisible).toBe(true)
    })

    ShouldHave('empty greeting', function() {
        expect(vm.greeting).toBe('')
    })

    ShouldHave('email visible', function() {
        expect(vm.emailIsVisible).toBe(true)
    })

    ShouldHave('password visible', function() {
        expect(vm.passwordIsVisible).toBe(true)
    })

    ShouldHave('sign up visible', function() {
        expect(vm.signUpIsVisible).toBe(true);
    })

    ShouldHave('feature combobox hidden', function() {
        expect(vm.featureIsVisible).toBe(false)
    })

    ShouldHave('not displayed the logo in the header bar', function() {
        expect(vm.bannerImageLocationIsVisible).toBe(false)
    })

    ShouldHave('made a request to see if the current user is already logged in', function() {
        expect(backend.getRequestsFor('user').length).toBe(1)
    })

    When('the user clicks login without any credentials', function() {
        Meaning(function() {
            vm.login()
        })

        ShouldHave('not called into the server to login', function() {
            expect(backend.getRequestsFor('login').length).toBe(0)
        })
    })

    When('the backend responds that ther user is not authenticated yet', function() {
        Meaning(function() {
            backend.respondTo('user', {
                error: 'Not Authenticated'
            })
        })

        ShouldHave('blank email', function() {
            expect(vm.email).toBe('')
        })

        ShouldHave('blank password', function() {
            expect(vm.password).toBe('')
        })

        ShouldHave('logout button hidden', function() {
            expect(vm.logoutIsVisible).toBe(false)
        })

        ShouldHave('login button should be visible', function() {
            expect(vm.loginIsVisible).toBe(true)
        })

        ShouldHave('empty greeting', function() {
            expect(vm.greeting).toBe('')
        })

        ShouldHave('email visible', function() {
            expect(vm.emailIsVisible).toBe(true)
        })

        ShouldHave('password visible', function() {
            expect(vm.passwordIsVisible).toBe(true)
        })

        ShouldHave('sign up visible', function() {
            expect(vm.signUpIsVisible).toBe(true);
        })

        ShouldHave('feature combobox hidden', function() {
            expect(vm.featureIsVisible).toBe(false)
        })

        When('the admin logs in', function() {
            Meaning(function() {
                vm.set('email', 'test')
                vm.set('password', 'admin')
                vm.login()
            })

            ShouldHave('called into the server to login', function() {
                expect(backend.getRequestsFor('login').length).toBe(1)
            })

            When('the backend responds', function() {
                Meaning(function() {
                    backend.respondTo('login')
                })

                ShouldHave('made a request to get the user', function() {
                    expect(backend.getRequestsFor('user').length).toBe(1)
                })

                When('the backend responds with the user', function() {
                    Meaning(function() {
                        backend.respondTo('user')
                    })

                    ShouldHave('populated the user feature combobox', function() {
                        expect(vm.featureStoreCount).toBe(3)
                    })

                    ShouldHave('login button should not be visible', function() {
                        expect(vm.loginIsVisible).toBe(false)
                    })

                    ShouldHave('logout button should be visible', function() {
                        expect(vm.logoutIsVisible).toBeTruthy()
                    })

                    ShouldHave('set the greeting for the user', function() {
                        expect(vm.greeting).toBe('Hello, Admin')
                    })

                    ShouldHave('email hidden', function() {
                        expect(vm.emailIsVisible).toBe(false)
                    })

                    ShouldHave('password hidden', function() {
                        expect(vm.passwordIsVisible).toBe(false)
                    })

                    ShouldHave('sign up hidden', function() {
                        expect(vm.signUpIsVisible).toBe(false)
                    })

                    ShouldHave('displayed the features combobox', function() {
                        expect(vm.featureIsVisible).toBe(true)
                    })

                    When('the admin chooses to manage accounts', function() {
                        Meaning(function() {
                            vm.set('feature', 'ManageAccounts')
                        })

                        ShouldHave('switched the screen to the manage accounts page', function() {
                            expect(vm.currentScreen.viewmodelName).toBe('ManageAccounts')
                        })

                        ShouldHave('initialized only 3 screens currently', function() {
                            expect(vm.addedScreenList.length).toBe(2)
                        })

                        // ShouldHave('made a request to the backend for first page of users', function() {
                        //     expect(backend.getRequestsFor('users').length).toBe(1)
                        // })

                        // When('the backend responds to the users request', function() {
                        //     Meaning(function() {
                        //         backend.respondTo('users')
                        //     })

                        //     ShouldHave('users listed in the store', function() {
                        //         // expect(vm.users.length).toBeGreaterThan(0)
                        //     })
                        // })

                        When('the user chooses to manage data', function() {
                            Meaning(function() {
                                vm.set('feature', 'ManageData')
                            })

                            ShouldHave('initialized only 4 screens currently', function() {
                                expect(vm.addedScreenList.length).toBe(3)
                            })

                            ShouldHave('switched the screen to the manage data page', function() {
                                expect(vm.currentScreen.viewmodelName).toBe('ManageData')
                            })

                            When('the user chooses to go back to manage accounts', function() {
                                Meaning(function() {
                                    vm.set('feature', 'ManageAccounts')
                                })

                                ShouldHave('still only initialized 4 screens currently (not created another instance of manage accounts)', function() {
                                    expect(vm.addedScreenList.length).toBe(3)
                                })

                                ShouldHave('switched the screen to the manage accounts page', function() {
                                    expect(vm.currentScreen.viewmodelName).toBe('ManageAccounts')
                                })
                            })
                        })
                    })

                    When('the admin chooses to manage data', function() {
                        Meaning(function() {
                            vm.set('feature', 'ManageData')
                        })

                        ShouldHave('switched the screen to the manage data page', function() {
                            expect(vm.currentScreen.viewmodelName).toBe('ManageData')
                        })
                    })

                    When('the admin chooses to go to the search', function() {
                        Meaning(function() {
                            vm.set('feature', 'Search')
                        })

                        ShouldHave('switched the screen to the search page', function() {
                            expect(vm.currentScreen.viewmodelName).toBe('Search')
                        })
                    })
                })
            })
        })

        When('the patient logs in', function() {
            Meaning(function() {
                vm.set('email', 'test')
                vm.set('password', 'patient')
                vm.login()
            })

            ShouldHave('called into the server to login', function() {
                expect(backend.getRequestsFor('login').length).toBe(1)
            })

            When('the backend responds', function() {
                Meaning(function() {
                    backend.respondTo('login')
                })

                ShouldHave('made a request to get the user', function() {
                    expect(backend.getRequestsFor('user').length).toBe(1)
                })

                When('the backend responds with the patient', function() {
                    Meaning(function() {
                        backend.respondTo('user')
                    })

                    ShouldHave('populated the patient feature combobox', function() {
                        expect(vm.featureStoreCount).toBe(1)
                    })

                    ShouldHave('login button should not be visible', function() {
                        expect(vm.loginIsVisible).toBe(false)
                    })

                    ShouldHave('logout button should be visible', function() {
                        expect(vm.logoutIsVisible).toBeTruthy()
                    })

                    ShouldHave('set the greeting for the patient', function() {
                        expect(vm.greeting).toBe('Hello, Patient')
                    })

                    ShouldHave('email hidden', function() {
                        expect(vm.emailIsVisible).toBe(false)
                    })

                    ShouldHave('password hidden', function() {
                        expect(vm.passwordIsVisible).toBe(false)
                    })

                    ShouldHave('sign up hidden', function() {
                        expect(vm.signUpIsVisible).toBe(false)
                    })

                    When('there is a logout', function() {
                        Meaning(function() {
                            vm.logout()
                        })

                        ShouldHave('called into the backend to log the user out', function() {
                            expect(backend.getRequestsFor('logout').length).toBe(1)
                        })

                        When('the backend responds to the logout', function() {
                            Meaning(function() {
                                backend.respondTo('logout')
                            })

                            ShouldHave('logged the account out', function() {
                                expect(vm.user).toBe(null)
                            })

                            ShouldHave('cleared the user feature combobox', function() {
                                expect(vm.featureStoreCount).toBe(0)
                            })

                            ShouldHave('login button should be visible', function() {
                                expect(vm.loginIsVisible).toBe(true)
                            })

                            ShouldHave('logout button should not be visible', function() {
                                expect(vm.logoutIsVisible).toBe(false)
                            })

                            ShouldHave('set the greeting for the user', function() {
                                expect(vm.greeting).toBe('')
                            })

                            ShouldHave('email visible', function() {
                                expect(vm.emailIsVisible).toBe(true)
                            })

                            ShouldHave('password visible', function() {
                                expect(vm.passwordIsVisible).toBe(true)
                            })

                            ShouldHave('sign up visible', function() {
                                expect(vm.signUpIsVisible).toBe(true)
                            })
                        })
                    })
                })
            })
        })

        When('the user logs in with bad credentials', function() {
            Meaning(function() {
                vm.set('email', 'test')
                vm.set('password', 'fail')
                vm.login()
            })

            ShouldHave('called into the server to login', function() {
                expect(backend.getRequestsFor('login').length).toBe(1)
            })

            When('the backend responds', function() {
                Meaning(function() {
                    spyOn(vm, 'showError');
                    backend.respondTo('login')
                })

                ShouldHave('not populated the user feature combobox', function() {
                    expect(vm.featureStoreCount).toBe(0)
                })

                ShouldHave('login button should be visible', function() {
                    expect(vm.loginIsVisible).toBe(true)
                })

                ShouldHave('logout button should not be visible', function() {
                    expect(vm.logoutIsVisible).toBe(false)
                })

                ShouldHave('set the greeting for the user', function() {
                    expect(vm.greeting).toBe('')
                })

                ShouldHave('email visible', function() {
                    expect(vm.emailIsVisible).toBe(true)
                })

                ShouldHave('password visible', function() {
                    expect(vm.passwordIsVisible).toBe(true)
                })

                ShouldHave('sign up visible', function() {
                    expect(vm.signUpIsVisible).toBe(true)
                })

                ShouldHave('displayed the error that was returned from the server', function() {
                    expect(vm.showError).toHaveBeenCalled()
                })
            })
        })
    })

    When('the user chooses to sign up for a new account', function() {
        Meaning(function() {
            vm.signUp()
        })

        ShouldHave('opened the new user dialog window', function() {
            //TODO: Open the window
        })
    })

    When('the user selects a cancer type with molecular sub-types (lung)', function() {
        Meaning(function() {
            vm.set('cancerType', 'lung')
        })

        ShouldHave('displayed the molecular sub-type combobox', function() {
            expect(backend.getRequestsFor('molecularSubTypes').length).toBe(1)
        })

        When('the backend responds with molecular sub-types', function() {
            Meaning(function() {
                backend.respondTo('molecularSubTypes')
            })

            ShouldHave('many sub types populted', function() {
                expect(vm.molecularSubTypeCount).toBeGreaterThan(0)
            })

            ShouldHave('made the sub types visible', function() {
                expect(vm.molecularSubTypeIsVisible).toBe(true)
            })
        })

        When('the user selects to find a trial on their own', function() {
            Meaning(function() {
                vm.currentScreen.letMeFindATrialOnMyOwn()
            })

            ShouldHave('switched to the search screen', function() {
                expect(vm.currentScreen.viewmodelName).toBe('Search')
            })

            ShouldHave('no current filters', function() {
                expect(vm.currentScreen.filterList.length).toBe(0)
            })

            ShouldHave('enabled advanced search', function() {
                expect(vm.currentScreen.isAdvancedSearch).toBe(true)
            })

            ShouldHave('displayed the logo in the header', function() {
                expect(vm.bannerImageLocationIsVisible).toBe(true)
            })

            ShouldHave('made a request to the server for the list of facets for the trials', function() {
                expect(backend.getRequestsFor('facets').length).toBe(1)
            })

            ShouldHave('made a request to the server for the list of exclusion facets for the trials', function() {
                expect(backend.getRequestsFor('exfacets').length).toBe(1)
            })

            ShouldHave('made a request to the server for the list of trials currently matching', function() {
                expect(backend.getRequestsFor('search').length).toBe(1)
            })

            When('the backend responds with the list of facets', function() {
                Meaning(function() {
                    backend.respondTo('facets')
                })

                ShouldHave('populated the facet list', function() {
                    expect(vm.currentScreen.facetStore.getCount()).toBeGreaterThan(0)
                })
            })

            When('the backend responds with the list of exclusion facets', function() {
                Meaning(function() {
                    backend.respondTo('exfacets')
                })

                ShouldHave('populated the exclusion facet list', function() {
                    expect(vm.currentScreen.exfacetStore.getCount()).toBeGreaterThan(0)
                })
            })

            When('the backend responds with search results', function() {
                Meaning(function() {
                    backend.respondTo('search')
                })

                ShouldHave('populated the search results', function() {
                    expect(vm.currentScreen.searchStore.getCount()).toBeGreaterThan(0)
                })

                When('the user changes the molecular sub type', function() {
                    Meaning(function() {
                        vm.set('molecularSubType', 'egfr')
                    })

                    ShouldHave('Searched again', function() {
                        expect(backend.getRequestsFor('search').length).toBe(1)
                    })

                    When('the backend responds', function() {
                        Meaning(function() {
                            backend.respondTo('search')
                        })

                        When('the user chooses a different cancer type', function() {
                            Meaning(function() {
                                vm.set('cancerType', 'anal')
                            })

                            ShouldHave('cleared the molecular sub type', function() {
                                expect(vm.molecularSubType).toBe('')
                            })

                            ShouldHave('refreshed the search store', function() {
                                //2 because clearing the sub-type will make a request as well
                                expect(backend.getRequestsFor('search').length).toBe(2)
                            })
                        })
                    })
                })
            })

            When('the user adds a filter to their search criteria', function() {
                Meaning(function() {
                    backend.respondTo('search')
                    backend.respondTo('facets')
                    backend.respondTo('exfacets')
                    vm.currentScreen.addFilter({
                        mtype: 'viewmodel',
                        criteria: 'Test',
                        include: true
                    })
                })

                ShouldHave('added the filter to the filter list', function() {
                    expect(vm.currentScreen.filterList.length).toBe(1)
                })

                ShouldHave('made a request to the server for the list of facets for the trials', function() {
                    expect(backend.getRequestsFor('facets').length).toBe(1)
                })

                ShouldHave('made a request to the server for the list of exclusion facets for the trials', function() {
                    expect(backend.getRequestsFor('exfacets').length).toBe(1)
                })

                ShouldHave('made a request to the server for the list of trials currently matching', function() {
                    expect(backend.getRequestsFor('search').length).toBe(1)
                })

            })
        })
    })

    When('the user selects a cancer type without any molecular sub-types (anal)', function() {
        Meaning(function() {
            vm.set('cancerType', 'anal')
        })

        ShouldHave('kept the molecular sub-type combobox hidden', function() {
            expect(backend.getRequestsFor('molecularSubTypes').length).toBeGreaterThan(0)
        })

        When('then backend responds', function() {
            Meaning(function() {
                backend.respondTo('molecularSubTypes')
            })

            ShouldHave('populated molecular subtypes with no records', function() {
                expect(vm.molecularSubTypeCount).toBe(0)
            })

            ShouldHave('set molecular subtypes to be hidden with no records', function() {
                expect(vm.molecularSubTypeIsVisible).toBe(false)
            })
        })
    })

    When('the user selects to find a trial on their own', function() {
        Meaning(function() {
            vm.currentScreen.letMeFindATrialOnMyOwn()
        })

        ShouldHave('switched to the search screen', function() {
            expect(vm.currentScreen.viewmodelName).toBe('Search')
        })

        ShouldHave('enabled advanced search', function() {
            expect(vm.currentScreen.isAdvancedSearch).toBe(true)
        })
    })

    When('the user selects to help them find a trial', function() {
        Meaning(function() {
            vm.currentScreen.helpMeFindATrial()
        })

        // ShouldHave('switched to the search screen', function() {
        //     expect(vm.currentScreen.viewmodelName).toBe('Search')
        // })

        // ShouldHave('enabled advanced search', function() {
        //     expect(vm.currentScreen.isAdvancedSearch).toBe(false)
        // })

        // ShouldHave('started the wizard', function() {
        //TODO: started the wizard? 
        // })
    })

});