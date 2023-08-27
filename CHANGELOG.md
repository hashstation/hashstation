v2.4.0 -> v?

New features:
* New option 'Use local (prestored) dictionaries on hosts' when 'Fragmentation of dictionaries' is set to 'On hosts'. Check README for more details.
* New option in the job detail view to export cracked/non-cracked hashes to file.
* New option in 'Hashes' to import/export cracked hashes from/to CSV file.
* New option in 'Hashes' to delete selected hashes.
* New column 'Est. remaining time' in the job workunits view, which is based on estimated end time computed by hashcat.
* Added possibility to select device types (CPU or GPU) to be used for cracking in Job's Host settings and also in host's 'Settings'.
* Added possibility to change hashcat's workload profile in job's 'Host settings' and also in host's 'Settings'.
* Added possibility to enable hashcat's slow candidates mode for dictionary, combinator and brute force attacks in 'Attack settings'.
* Added possibility to enter job specific extra hashcat args in 'Attack settings'.
* Added possibility to enter host specific extra hashcat args in host's 'Settings'.
* Added possibility to set fixed workunit size in 'Advanced settings'.
* Added possibility to change runtime limit for benchmarks (default 30 seconds) in 'System settings'.
* Added possibility to change workunit status update frequency (default 5 seconds) in 'System settings'.
* Added support to automatically extract hashes from Bitcoin/Litecoin/Ethereum/Exodus/MetaMask/Electrum wallets.
* Added possibility to set priority (low/normal/high) of a new job in 'Scheduling settings'.
* Added possibility to resume timeouted jobs.

General improvements:
* Improved/reimplemeted generator and scheduling logic. Better precision, more predictable workunit sizes. Default desired seconds per workunit changed to 600 seconds.
* Improved benchmarking logic.
* Improved 'Add New Job' UI, small redesign.
* It is now possible to upload dictionaries from any folders on the server.
* It is now possible to upgrade standard (non-dockerized) Fitcrack to newer versions. Please see UPGRADE.md file.
* Settings per hosts.
* Updated to BOINC v7.23.

Fixes:
* Fixed slow loading of a host detail page.
* Hosts view: job is active if its status is running or finishing.
* Fixed speed numbers in job detail page when cracking salted hashes.
* Fixed issue when some workunits could not be fully computed.
* Fixed broken sorting and pagination in 'Hashes'.

