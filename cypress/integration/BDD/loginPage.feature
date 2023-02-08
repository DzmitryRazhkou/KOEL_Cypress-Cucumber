Feature: KOEL Login Page Feature

Background: 
Given User navigates login Page

Scenario: Login With Correct Credentials Test
When User types correct credentials
|email|password|
|dimagadjilla@gmail.com|te$t$tudent|

Then User successfully logs in "Home"
And User navigates on the main page

Scenario: Login With Incorrect Credentials Test
When User types incorrect credentials
|email|password|
|dimagadjilla_@gmail.com|te$t_$tudent|

Then Pop up error is showed up

Scenario: Login With Correct Credentials Thru API POST Call Test
When User provides correct credentials into POST Call body
|email|password|
|dimagadjilla@gmail.com|te$t$tudent|

Then User successfully logs in "Home"
And User navigates on the main page

Scenario: Register A New Student Test
When User clicks on the registration button
And User types email for registration
Then Successfull registration message should be "Registration Successful"

Scenario: Login and Log Out Using GUI Test
When User types correct credentials
|email|password|
|dimagadjilla@gmail.com|te$t$tudent|

And User clicks log out button
Then Login page title should be 'Koel'

Scenario: Login and Log Out Using API Test
When User provides correct credentials into POST Call body
|email|password|
|dimagadjilla@gmail.com|te$t$tudent|

And User successfully logs in "Home"
Then User logs out with using API Delete Call
And Login page title should be 'Koel'

