#!/usr/bin/python3

import psutil
import time
import requests
import datetime

server = "http://localhost:5000"

def main():
    minutes = 0

    while True:
        cpu = 0
        mem = 0

        hdd_read = psutil.disk_io_counters(nowrap=True).read_bytes
        hdd_write = psutil.disk_io_counters(nowrap=True).write_bytes
        recv = psutil.net_io_counters(nowrap=True).bytes_recv
        sent = psutil.net_io_counters(nowrap=True).bytes_sent

        for i in range(60):
            cpu += psutil.cpu_percent()
            mem += psutil.virtual_memory().percent
            time.sleep(1)

        minutes += 1
        cpu /= 60
        mem /= 60
        hdd_read = (psutil.disk_io_counters(nowrap=True).read_bytes - hdd_read) / 60
        hdd_write = (psutil.disk_io_counters(
                nowrap=True).write_bytes - hdd_write) / 60
        net_recv = (psutil.net_io_counters(nowrap=True).bytes_recv - recv) / 60
        net_sent = (psutil.net_io_counters(nowrap=True).bytes_sent - sent) / 60

        hdd_read *= 8
        hdd_write *= 8
        net_recv *= 8
        net_sent *= 8

        hdd_read /= 1000
        hdd_write /= 1000
        net_recv /= 1000
        net_sent /= 1000

        print("CPU: " + str(cpu))
        print("MEM: " + str(mem))

        print("NET_D: " + str(net_recv))
        print("NET_U: " + str(net_sent))

        print("HDD_R: " + str(hdd_read))
        print("HDD_W: " + str(hdd_write))

        usage_data = {}
        usage_data['cpu'] = str(cpu)
        usage_data['ram'] = str(mem)
        usage_data['net_recv'] = str(net_recv)
        usage_data['net_sent'] = str(net_sent)
        usage_data['hdd_read'] = str(hdd_read)
        usage_data['hdd_write'] = str(hdd_write)

        try:
            response = requests.post(server + "/serverInfo/usageData", data=usage_data)
            response.raise_for_status()
        except Exception as e:
            print(datetime.datetime.utcnow(),
                    '[WARN]: Unknown exception occured in sending usage data:', e)

        if minutes == 7 * 24 * 60: # 7 days
            try:
                response = requests.delete(server + "/serverInfo/usageData", data={'days': 7})
                response.raise_for_status()
                print("deleted")
            except Exception as e:
                print(datetime.datetime.utcnow(),
                    '[WARN]: Unknown exception occured in deleting old usage data:', e)
            minutes = 0


if __name__ == '__main__':
    main()
