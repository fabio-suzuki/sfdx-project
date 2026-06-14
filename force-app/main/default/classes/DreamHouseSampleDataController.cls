public with sharing class DreamHouseSampleDataController {

    @RemoteAction
    public static void deleteAll() {
        DELETE [SELECT ID FROM property__c];    
        DELETE [SELECT ID FROM broker__c];
    }    
}