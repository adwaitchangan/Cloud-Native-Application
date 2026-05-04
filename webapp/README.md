# Web Application
Name : Adwait Changan
Nue ID : 002201568

## Instructions to Run the application Locally: 
1. Clone the Organization Repository
2. Navigate to web folder
    - Install node modules with: npm install
    - Add .env enviornment to the project directory
3. Start the server with: npm start
4. Test API request with postman

#### Assignment 1
1. Developed GET /healthz API which returns connection status with database
2. Handled edge cases and negative cases to return appropriate status code on a bad request

#### Assignment 2
1. Created GET,PUT,POST user related API with basic authentication.
2. Application automatically bootstraps the database at startup 
3. Implemented Continuous Integration (CI) with GitHub Actions
4. Deploy application on centos

#### Assignment 3
1. Create integration testcases for user APIs
2. Develop Git workflow file to run test cases before a merge request

#### Assignment 4
1. Created Packer file to create golden images on gcp.
2. Added Workflow files to validate and build packer files.
3. To Build Packer file run 
    packer init .
    packer fmt .
    packer validate gcp.pkr.hcl

#### Assignment 5
1. Updated Shell script to remove installation of mySQL server in local for instance.
2. Instance will get use mySQL cloud instance for webapp.
