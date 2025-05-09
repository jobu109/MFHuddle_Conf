using System;
using System.Collections.Generic;
using System.Linq;
using Crestron.SimplSharpPro.DeviceSupport;
using Crestron.SimplSharpPro;

namespace MF_Huddle_Conf
{
    /// <summary>
    /// Common Interface for Root Contracts.
    /// </summary>
    public interface IContract
    {
        object UserObject { get; set; }
        void AddDevice(BasicTriListWithSmartObject device);
        void RemoveDevice(BasicTriListWithSmartObject device);
    }

    /// <summary>
    /// Conference_Huddle Room CH5
    /// </summary>
    public class Contract : IContract, IDisposable
    {
        #region Components

        private ComponentMediator ComponentMediator { get; set; }

        public MF_Huddle_Conf.IPower PowerOn { get { return (MF_Huddle_Conf.IPower)InternalPowerOn; } }
        private MF_Huddle_Conf.Power InternalPowerOn { get; set; }

        public MF_Huddle_Conf.IVolume VolumeLevel { get { return (MF_Huddle_Conf.IVolume)InternalVolumeLevel; } }
        private MF_Huddle_Conf.Volume InternalVolumeLevel { get; set; }

        #endregion

        #region Construction and Initialization

        public Contract()
            : this(new List<BasicTriListWithSmartObject>().ToArray())
        {
        }

        public Contract(BasicTriListWithSmartObject device)
            : this(new [] { device })
        {
        }

        public Contract(BasicTriListWithSmartObject[] devices)
        {
            if (devices == null)
                throw new ArgumentNullException("Devices is null");

            ComponentMediator = new ComponentMediator();

            InternalPowerOn = new MF_Huddle_Conf.Power(ComponentMediator, 1);
            InternalVolumeLevel = new MF_Huddle_Conf.Volume(ComponentMediator, 2);

            for (int index = 0; index < devices.Length; index++)
            {
                AddDevice(devices[index]);
            }
        }

        #endregion

        #region Standard Contract Members

        public object UserObject { get; set; }

        public void AddDevice(BasicTriListWithSmartObject device)
        {
            InternalPowerOn.AddDevice(device);
            InternalVolumeLevel.AddDevice(device);
        }

        public void RemoveDevice(BasicTriListWithSmartObject device)
        {
            InternalPowerOn.RemoveDevice(device);
            InternalVolumeLevel.RemoveDevice(device);
        }

        #endregion

        #region IDisposable

        public bool IsDisposed { get; set; }

        public void Dispose()
        {
            if (IsDisposed)
                return;

            IsDisposed = true;

            InternalPowerOn.Dispose();
            InternalVolumeLevel.Dispose();
            ComponentMediator.Dispose(); 
        }

        #endregion

    }
}
